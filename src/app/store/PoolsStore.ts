import { action, autorun, computed, flow, makeAutoObservable, makeObservable, observable, observe, reaction, toJS } from "mobx";
import { AbstractStore } from "./AbstractStore";
import { RootAccessor } from "./RootAccessor";
import { computedFn, fromResource, IResource } from "mobx-utils";
import _ from "lodash";
import { IDexStoreShaderAsyncInit } from "./types";
import { observer } from "mobx-react-lite";
import { Pool, PoolsFactory } from "@app/library/dex/Pool";
import { AssetInPool, Kind, PoolRaw } from "@app/library/dex/types";
import { MultiDictionary } from "typescript-collections";
import { Asset } from "@app/library/base/assets/types";

type PoolResource = IResource<Array<PoolRaw>>;
type DictKey = {assetId:number, kind: Kind};
type UniquePoolsAssetsDict = MultiDictionary<DictKey, AssetInPool>;

export class PoolsStore extends AbstractStore implements IDexStoreShaderAsyncInit {

    poolsSinkResource: PoolResource;

    pools: Pool[] = [];
    poolsAssetsIds: Array<number> = [];
    uniquePoolsPairs: UniquePoolsAssetsDict = new MultiDictionary((key: DictKey) => '$o' + key.assetId + key.kind);

    resolvePoolByKindAssets = computedFn(({assetA,assetB, kind} : {assetA: Asset, assetB: Asset, kind: Kind}) => {
        console.log("resolvePoolByKindAssets assetA,assetB, kind",assetA,assetB, kind);
        return _.find(toJS(this.pools), function (pool: Pool) { 
            return pool.isPoolByKindAssets(assetA, assetB, kind)
        })
    })
    
    constructor(accessor: RootAccessor){
        super(accessor);

        makeObservable(this, {
            pools: observable,
            poolsAssetsIds: observable,
            poolsSinkResource: observable,
            uniquePoolsPairs: observable,
            initShaderAsync: action,
            reloadPoolAssets: flow,
            // @ts-ignore - protected methods
            autoSinkUpdatePools: false,
            calculatePoolsAssetsIds: false,
            calculateUniquePoolsPairs: false,
            initAsyncReactions:false,
            filterPools: false,
        });

    }

    protected filterPools(pools) {
        return _(pools).filter((pool) => pool/* .ctl > 0 */).value();
    }

    public *reloadPoolAssets() {
        const response = yield this.dexApiMethods.poolsView();

        this.pools = PoolsFactory(
            this.filterPools(response)
        )
    }

    public initAsyncReactions(): void{

        /**
         * Initialize pools here
         * 
         * It is very important to load all assets list from contract before pool initialization
         * so we wait for the assets list and after initialize pools
         */
        reaction(() => this.accessor.assetsStore.isLoaded, () => this.reloadPoolAssets());

        // start the timer for pools update every n second
        this.poolsSinkResource = this.autoSinkUpdatePools(60000);

        reaction(() => this.poolsSinkResource.current(), (newValue, oldValue) => {
            if(
                this.poolsSinkResource.current().length && 
                JSON.stringify(newValue) !== JSON.stringify(oldValue)
            )
            
            //retrive only ctl > 0 pools
            this.pools = PoolsFactory(
                this.filterPools(this.poolsSinkResource.current())
            );
        } )

        reaction(() => this.pools, (newValue, oldValue) => {
                console.log("Calculating pool asssets");
                this.calculatePoolsAssetsIds();
        })

        reaction(() => this.poolsAssetsIds, () => {
            console.log("Calculating unique pools pairs");
            this.calculateUniquePoolsPairs();
        })
    } 

    public initShaderAsync(): Promise<void> {
        return new Promise((resolve, reject) => {
            resolve(console.log("init "))
            /* this.dexApiMethods.poolsView().then(response => {
                this.pools = PoolsFactory(
                    this.filterPools(response)
                )
            })
            resolve(); */
        })
    }

    protected autoSinkUpdatePools(interval): PoolResource {
        let subscriptionHandler

        return fromResource(
            async sink => {
                subscriptionHandler = setInterval(
                    async () => sink(
                        await this.dexApiMethods.poolsView()
                    ),
                    interval
                );
            },
            () => {
                clearInterval(subscriptionHandler);
            },
            [] as PoolRaw[]
        );
    }

    calculatePoolsAssetsIds() {
        this.poolsAssetsIds = _.chain(this.pools).reduce(
            (acc, pool: Pool) => {
              return [...acc, ...pool.getAssetsPair.map(asset => asset.id)];
            },
            []
          ).uniq().value();
    }


    calculateUniquePoolsPairs() {
        //enum to number
        const kinds = Object.values(Kind).filter((v) => !isNaN(Number(v)));

        _.forEach(kinds, (kind: number) => {
            _.forEach(this.poolsAssetsIds, (assetId: number) => {
                //assets array
                const assets: AssetInPool[] = _.chain(this.pools).reduce((acc, pool: Pool) => {
                    
                    if(pool.isAssetIdInPool(assetId) && pool.poolType === kind) {
                        const paired = pool.getAssetPairedWith(assetId);
                        return [...acc, paired]
                    }

                    return acc;
                }, []).without(assetId).uniqBy('id').value();
                
                //console.log("kind:", kind, "assetId:", assetId, "assets:", assets);
                
                //if found assets are not empty
                assets.length && this.uniquePoolsPairs.setValue(
                    {assetId: assetId, kind: kind}, assets
                );
            })    
        })
    }
}