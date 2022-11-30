import { Decimal } from "@app/library/base/Decimal";
import { action, computed, flow, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import { AbstractStore } from "./AbstractStore";
import { RootAccessor } from "./RootAccessor";

export interface RateResponse {
    beam: {
      usd: number;
    };
  }

export class RateStore extends AbstractStore{

    rate: Decimal;
    
    constructor(accessor: RootAccessor){
        super(accessor);

        makeObservable(this, {
            rate: observable,
            startLoadRateInterval: flow,
            loadRatesApiCall: false,
            isZero: computed
        })
    }

    async loadRatesApiCall() {
        const API_URL = 'https://api.coingecko.com/api/v3/simple/price';
        const RATE_PARAMS = 'ids=beam&vs_currencies=usd';

        const response = await fetch(`${API_URL}?${RATE_PARAMS}`);
        const promise: RateResponse = await response.json();
        return promise.beam.usd;
      }

    *startLoadRateInterval() {
        const FETCH_INTERVAL = 10000;
        
        try {
          const price = yield this.loadRatesApiCall();
          this.rate = Decimal.from(price);
          
      
          setTimeout(
            () => runInAction(() => this.startLoadRateInterval()),
            FETCH_INTERVAL,
          );
        } catch (e) {
          console.log(e);
        }
      }

      get isZero() {
        return !this.rate;
      }
}