import { AssetsStore } from "./AssetsStore";
import { ContractStore } from "./ContractStore";
import { PoolsStore } from "./PoolsStore";
//import { CurrentPoolStore } from "./CurrentPoolStore";
import { RateStore } from "./RateStore";
import { RootAccessor } from "./RootAccessor";
import { SharedStore } from "./SharedStore";
import { TransactionsStore } from "./TransactionsStore";

const createStoreAccessor =  (): RootAccessor => {
    return (new RootAccessor).initRootStore([
        SharedStore,
        RateStore,
        PoolsStore,
        TransactionsStore,
        ContractStore,
        AssetsStore,
        //CurrentPoolStore,
    ]);
}


export default createStoreAccessor;