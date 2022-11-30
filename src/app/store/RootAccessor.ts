import _ from "lodash";
import { IDexStore, IDexStoreShaderAsyncInit, IDexStoreFactoryWrapper, IDexStoreAsyncReactionsInit } from "./types";

export class RootAccessor implements Record<string, IDexStoreFactoryWrapper> {

    [storeSignature: string]: IDexStoreFactoryWrapper | any;

    public initRootStore(storeDependencies: Array<IDexStoreFactoryWrapper>): RootAccessor {
        storeDependencies.forEach((storeClass)=> {
            const storePropName = _.camelCase(storeClass.name)
            const prop = this.create(storeClass, this)
            
            this[storePropName] = prop;
        }, this);

        this.initStoresAsyncReactions();
        
        return this;
    }

    public async initStoresAsyncReactions() {
        function instanceOfIDexStoreAsyncInit(object: any): object is IDexStoreAsyncReactionsInit {
            return 'initAsyncReactions' in object;
        }

        const propsNames: string[] = Object.getOwnPropertyNames(this);

        _.forEach(propsNames, (propName: string) => {
            if(instanceOfIDexStoreAsyncInit(this[propName])) {
                console.log("this[propName]", this[propName]);
                (this[propName] as IDexStoreAsyncReactionsInit).initAsyncReactions();
            }
        })
    }


    public async initStoresShaderAsync() {
        function instanceOfIDexStoreAsyncInit(object: any): object is IDexStoreShaderAsyncInit {
            return 'initShaderAsync' in object;
        }

        const propsNames: string[] = Object.getOwnPropertyNames(this);

        _.forEach(propsNames, (propName: string) => {
            if(instanceOfIDexStoreAsyncInit(this[propName])) {
                console.log("this[propName]", this[propName]);
                (this[propName] as IDexStoreShaderAsyncInit).initShaderAsync().then((res) => {
                    console.log(res);
                });
            }
        })
    }

    protected create<T>(model: new (...args: any) => T, ...args): T {
        return new model(...args);
    }

    
}