import { makeObservable } from "mobx";
import { AbstractStore } from "./AbstractStore";
import { RootAccessor } from "./RootAccessor";

export class CurrentPoolStore extends AbstractStore {
    
    constructor(accessor: RootAccessor){
        super(accessor)

        makeObservable(this, {

        });
        
    }
}