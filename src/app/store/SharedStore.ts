import { action, flow, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import { RootAccessor } from "./RootAccessor";
import { getApi } from '@app/utils/getApi';
import _ from "lodash";
import { AMM_CID } from "@app/constants";
import { AbstractStore } from "./AbstractStore";

export class SharedStore extends AbstractStore{

    errorMessage = null;

    systemState = {
      current_height: 0,
      current_state_hash: '',
      current_state_timestamp: 0,
      is_in_sync: false,
      prev_state_hash: '',
      tip_height: 0,
      tip_prev_state_hash: '',
      tip_state_hash: '',
      tip_state_timestamp: 0
    }

    isLoaded = false;
    dappVersion = {};
    
    constructor(accessor: RootAccessor) {
        super(accessor);

        makeObservable(this,{
            errorMessage: observable,
            systemState: observable,
            isLoaded: observable,
            dappVersion: observable,
            loadAppParams: flow,
            loadContractInfo: flow,
            setDappVersion: action,
            setSystemState: action,
        })
    }


    public *loadAppParams() {
        try {
        
            if (!this.isLoaded && _.isEmpty(this.dexApiMethods)) {
              yield null;
            }
        
            if (!this.isLoaded) {
              runInAction(() => this.loadContractInfo())
            }
        
          } catch (e) {
            console.log(e);
          }
    }   

    public *loadContractInfo(){
        try {
            const adminViewData = yield this.dexApiMethods.viewDeployed();
        
            const contract = adminViewData.contracts.find(item => item.cid === AMM_CID);
            
            if (contract) {
                this.accessor.contractStore.contract = contract;
            }

          } catch (e) {
            console.log(e);
          }
    }

    public setDappVersion(result) {
        runInAction(() => {
            this.dappVersion = result;
            this.isLoaded = true;
        })
        
    }

    public setSystemState = (result) => {
        this.systemState = result;
    }


}