import { action, flow, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import { RootAccessor } from "./RootAccessor";
import _ from "lodash";
import { AbstractStore } from "./AbstractStore";
import { AssetsRegistry } from "@app/library/base/assets/AssetsRegistry";
import { RawAsset } from "@app/library/base/assets/types";

export class AssetsStore extends AbstractStore{

    errorMessage = null;
    isLoaded = false;
    assetsList = [];
    
    constructor(accessor: RootAccessor) {
        super(accessor);

        makeObservable(this,{
            errorMessage: observable,
            assetsList: observable,
            isLoaded: observable,
            loadAssetsList: flow,
        })
    }


    public *loadAssetsList() {
        try {
            this.isLoaded = false;
            console.log(this.dexApiMethods);
            const assets: RawAsset[] = yield this.dexApiMethods.viewAllAssets();
            //console.log("assets",assets);
            AssetsRegistry.getRegistry(assets);

            this.isLoaded = true;

          } catch (e) {
            this.errorMessage = e.message;
            console.log(e);
          }
    }   


}