import {AssetInPool, Kind, MetaInfo, PoolRaw} from "./types"
import { Decimal } from "../base/Decimal";
import { GROTHS_IN_BEAM } from "@app/constants";
import { AssetsRegistry } from "../base/assets/AssetsRegistry";
import { Asset } from "../base/assets/types";

export class Pool {

    protected assetA: AssetInPool;
    protected assetB: AssetInPool;
    protected ctlAmount: Decimal;
    protected poolKind: Kind;

    protected isCreator: boolean;

    constructor(poolsData: PoolRaw) {
        const {aid1, aid2, ctl, tok1, tok2, kind, creator} = poolsData;

        this.ctlAmount = Decimal.from(ctl);
        this.poolKind = kind;
        this.isCreator = !!creator;

        this.assetA = this.processAsset(aid1,tok1,);
        this.assetB = this.processAsset(aid2,tok2,);

    }

    protected processAsset(id, tok): AssetInPool {
        const assetsRegistry = AssetsRegistry.getRegistry();
        return  {
            ...assetsRegistry.getValue(id), 
            amount: Decimal.from(tok).div(GROTHS_IN_BEAM),
            amountInGroth: Decimal.from(tok),
        }
    }

   public getAssetDataById(assetId): AssetInPool {
    return this.assetA.id === assetId ? this.assetA : this.assetB.id === assetId ? this.assetB : null;
   }

   public isPoolByKindAssets(assetA: Asset, assetB: Asset, kind: Kind): boolean {
    return ( this.assetA.id === assetA.id || this.assetA.id === assetB.id ) && 
        (this.assetB.id === assetA.id || this.assetB.id === assetB.id) && 
        this.poolKind === kind;
   }

   public getAssetTokFromPool(asset: Asset): Decimal {
    
    const assetInPool = this.getAssetDataById(asset.id);
    return assetInPool.amountInGroth;
   }

   get isUserCreatorOfPool() {
    return this.isCreator;
   }

   get poolType(): Kind {
    return this.poolKind;
   }

   get isEmpty(): boolean {
    return this.ctlAmount.isZero;
   }

   get getAssetsPair(): [AssetInPool, AssetInPool] {
    return [this.assetA, this.assetB];
   }

   get getAssetsPairIds(): number[] {
    return this.getAssetsPair.map(asset => asset.id);
   }

   public isAssetIdInPool(assetId: number) {
    return this.getAssetsPairIds.includes(assetId);
   }

   public getAssetPairedWith(asset: number | Asset): AssetInPool {
    try {
        const assetId: number = Number.isInteger(asset) ? asset : asset.id;

        if(!this.getAssetsPairIds.includes(assetId))
            throw new Error("Asset does not exists on the pool");
        
        return this.getAssetsPair.filter(asset => asset.id !== assetId).pop();
    } catch(e) {
        console.error();
        return null;
    }
    
   }

}

export const PoolsFactory = (pools: PoolRaw[]) => {
    return pools.map((pool) => new Pool(pool));
}