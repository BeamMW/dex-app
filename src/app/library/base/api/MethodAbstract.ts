import Utils from "../utils"
import ApiError from "./ApiError";
import { IMethodFactory } from "./Interfaces";
import { ShaderStore } from "./ShaderApi";
import { MethodRoles } from "./types";

export class MethodFactory/* <ShaderActions> */ implements IMethodFactory {
    createShaderMethod(type: string): any {
        if (type === "writable") {
            return MethodWritable;
        } else if (type === "readable") {
            return MethodReadable;
        }
    }
}

class Callable extends Function {
    constructor() {
        super();

        return new Proxy(this, {
            apply: (target, thisArg, args) => target.callMethod(...args)
        })
    }
}


export default abstract class MethodAbstract<ShaderActions> extends Callable {

    readonly waitingTime = 5000;

    protected cid: string;
    protected role: MethodRoles;
    protected action: ShaderActions;
    //protected params: string;

    protected couldPredict: boolean = false;
    protected requiredParams: Array<string> = [];
    protected allowedParams: Array<string> = [];

    constructor(cid: string, role: MethodRoles, action: ShaderActions, requiredParams?: Array<string>, allowedParams?: Array<string> ,couldPredict?: boolean) {
        super();

        this.role = role;
        this.cid = cid;
        this.action = action;

        couldPredict ? this.couldPredict = couldPredict : null;
        requiredParams ? this.requiredParams = requiredParams : null;
        allowedParams ? this.allowedParams = allowedParams : null;
    }

    protected validateContractParams(key) {
        /**
         * @TODO: fix bPrecictOnly safe logic
         * We removed bpredict only because of predictoin in writable methods so now we have to call the methods
         */
        if ([/* "bPredictOnly",  */"cid", "role", "action"].includes(key)) {
            throw new ApiError(0, `Do not pass explicitly [${key}] prop as param`, false);
        }
    }

    protected convertContractParams(params: object | null) {
        this.checkRequiredParams(params);
        
        //@TODO: implement validator for alowedParams prop

        let generatedParamsString: string = `cid=${this.cid}${this.role ? ",role=" + this.role : ""},action=${this.action},`;

        params && Object.keys(params).forEach((key, idx, keys) => {
            this.validateContractParams(key);

            generatedParamsString += `${key}=${params[key]}${idx === keys.length - 1 ? "" : ","}`;
        });

        return generatedParamsString;
    }

    protected checkRequiredParams(params: object | null) {
        if (this.requiredParams.length) return;
        //Implement cid pass logic
        let requiredChecker = (passParams, requiredParams) => requiredParams.every(param => passParams.includes(param));

        if (params && !requiredChecker(Object.keys(params), this.requiredParams))
            throw new ApiError(0, "Absence of required params", true);
    }

    async waitTransactionStatusUntil<T = any>(txId, methodName?): Promise<T> {
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    let { res } = await Utils.callApiAsync('tx_status', { txId: txId, rates: false })

                    if (["pending", "in progress", "registering"].indexOf(res.status_string) !== -1) {
                        console.log(`${methodName ?? 'x'} pending...`);
                    } else if (["canceled", "failed"].indexOf(res.status_string) !== -1) {
                        console.log(`${methodName ?? ''} error with status ${res.status_string}`);
                        throw new ApiError(0, `${methodName ?? ''} error with status ${res.status_string}`, true);
                    } else {
                        resolve(res);
                        clearInterval(interval)

                        console.log(`${methodName ?? ''} transaction complited with status:`, res.status_string, res.status);
                    }
                }
                catch (err) {
                    console.log(err);
                    reject(err);
                    clearInterval(interval);
                    throw new Error(err);
                }
            }, this.waitingTime);
        });
    }

    protected processInvokeParamsToWalletShader() {
        if (this.cid !== Utils.currentShaderBytesCid) {
            Utils.currentShaderBytesCid = this.cid;
            const shader = ShaderStore.retriveShader(this.cid);

            /**
             * Prepare(Array.from) for json stringify operatio
             */
            return Array.from(shader?.shaderBytes);
        }

        return null;
    }

    abstract callMethod<T = any>(params?: object): Promise<T>;

}

export class MethodReadable<ShaderActions> extends MethodAbstract<ShaderActions> {
    async callMethod<T = any>(params?: any): Promise<T> {
        const { res: result } = await Utils.invokeContractAsync(
            this.convertContractParams(params),
            this.processInvokeParamsToWalletShader()
        );
        //console.log("res", result);
        //temp solution for res error responses
        if (result?.error) {
            throw new ApiError(0, result?.error, false);
        }

        return result?.res ? result.res : result;
    }
}

//@TODO:IMPLEMENT PREDICT CALL!
export class MethodWritable<ShaderActions> extends MethodAbstract<ShaderActions> {

    protected withPredictable(params?: any) {
        if (typeof params !== "object") throw new ApiError(0, "passed params must be a string", false);

        return Object.assign(params, { bPredictOnly: 1 });
    }

    async predictiveCall<T = any>(params: object | null): Promise<T> {
        if (!this.couldPredict)
            throw new ApiError(0, "This method couldn't be predicted in shader call!", false);

        const { res: result } = await Utils.invokeContractAsync(
            this.convertContractParams(this.withPredictable(params)),
            this.processInvokeParamsToWalletShader()
        );
        //console.log("predict res", result);
        if (result?.error) {
            throw new ApiError(0, result?.error, false);
        }

        return result?.prediction ? result.prediction : result;
    }

    async callMethod<T = any>(params: object | null): Promise<T> {
        try {
            if (!!params?.predict) {
                //remove predict field
                const { predict, ...paramsModified } = params;

                return this.predictiveCall(paramsModified);
            }

            let txId = await Utils.invokeContractAsyncAndMakeTx(
                this.convertContractParams(params),
                this.processInvokeParamsToWalletShader()
            );

            if (!txId) {
                throw new ApiError(0, "txId do not created!", true);
            }

            console.log(txId);
            //@TODO:looK!
            return () => this.waitTransactionStatusUntil(txId, "")

        } catch (e) {
            console.log(e);
            throw new Error(e.error);
        }
    }
}