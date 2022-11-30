import { action, makeAutoObservable, makeObservable, observable, toJS } from "mobx";
import { AbstractStore } from "./AbstractStore";
import { RootAccessor } from "./RootAccessor";

export class TransactionsStore extends AbstractStore {

    transactions = [];

    constructor(accessor: RootAccessor) {
        super(accessor);

        makeObservable(this, {
            transactions: observable,
            udpateTransactions: action,
        })
    }

    udpateTransactions(transactions = []){
        try {
            console.log("UPDATE TRANSACTIONS!", transactions);
            this.transactions = this.transactions.length ? 
              [...new Map([...this.transactions, ...transactions].map((item) => [item.txId, item])).values()] : 
              transactions;
      
          } catch (e) {
            console.log(e)
          }
    }


}