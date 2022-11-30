import ShaderApi, { ShaderStore } from "@app/library/base/api/ShaderApi";
import { getApi } from "@app/utils/getApi";
import { makeObservable, observable, runInAction } from "mobx";
import { RootAccessor } from "./RootAccessor";
import { IDexStore } from "./types";


export abstract class AbstractStore implements IDexStore {
    public accessor: RootAccessor;
    protected apiMethods: any;

    constructor(accessor: RootAccessor) {
        this.accessor = accessor;

        makeObservable(this, {
            accessor: false,
        })
        
    }

    get dexApiMethods() {
        if(!this.apiMethods) {
            try {
                this.apiMethods = getApi();
            } catch(e) {
                throw new Error(e);
            }
        }

        return this.apiMethods;
        
    }

}