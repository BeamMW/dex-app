import { makeAutoObservable, makeObservable, observable } from "mobx"
import { AbstractStore } from "./AbstractStore";
import { RootAccessor } from "./RootAccessor"

export class ContractStore extends AbstractStore {
    
    contract: any;
    
    constructor(accessor: RootAccessor){
        super(accessor);

        makeObservable(this, {
            contract: observable
        })
    }




}