import { Asset as AssetType, AssetDictionary, IAssetMeta, RawAsset } from "./types";
import assets from "./dappnetAssetsList.json";
import { Dictionary } from "typescript-collections";
import { getMatches } from "../appUtils";

/* import { createRequire } from "module";
const require = createRequire(import.meta.url); */

const DEFAULT_BEAM_ASSET = 0;

export class AssetsRegistry {
    protected registry: AssetDictionary
    protected rawAssets: any = null;

    protected static registryInstance: AssetsRegistry = null;

    protected constructor(rawAssets){
        this.rawAssets = rawAssets;
        this.registry = this.createRegistryDict();
    }
    
    public static initRegistry(rawAssets: RawAsset[] = []) {
        console.log(!rawAssets.length ? "static init" : "dynamic init");
        this.registryInstance = new AssetsRegistry(
            !rawAssets.length ? ImportStaticAssets.getStaticAssets() : rawAssets
        );
    }
    
    public static getRegistry(rawAssets: RawAsset[] = []): AssetDictionary {
        if(!this.registryInstance) {
            AssetsRegistry.initRegistry(rawAssets)    
        }

        return this.registryInstance.registry;
    }

    protected createRegistryDict(): AssetDictionary {
        const registryDict = new Dictionary<number, AssetType>();
        
        this.rawAssets.map((rawAsset: RawAsset) => {
            try {
                registryDict.setValue(rawAsset.aid, {
                    id: rawAsset.aid,
                    meta: this.parseFromRaw(rawAsset),
                    raw: rawAsset,
                });
            } catch(e) {
                console.log(`${rawAsset.metadata} ${e}`);
            }
        })

        //add native beam asset if does not exist
        !registryDict.getValue(DEFAULT_BEAM_ASSET) && registryDict.setValue(DEFAULT_BEAM_ASSET, {
            id: DEFAULT_BEAM_ASSET,
            meta: new AssetMeta("Beam", "Beam native", "beam.svg"),    
        })

        return registryDict;
    }

    protected parseFromRaw(rawAsset: RawAsset): AssetMeta {
        const name = getMatches(rawAsset.metadata, /SN=(.*?);/gmi);
        const desciption = getMatches(rawAsset.metadata, /\;N=(.*?);/gmi);
        const iconPath = `${name.toLowerCase()}.svg`;
        
        return new AssetMeta(name, desciption, iconPath);
    }
}

export class AssetMeta implements IAssetMeta {
    
    constructor(
        protected name: string, 
        protected description?: string, 
        protected iconPath?: string
    ) {}

    get assetName(): string {
        return this.name;
    }
    get assetIconPath(): any {
        return this.iconPath;
    }
    get assetDescription(): any {
        return this.description;
    }

}

class ImportStaticAssets{

    protected static resolvePath(): string {
        return "./static/dappnetAssetsList.json"
    }

    static getStaticAssets(): RawAsset[] {
        const filePath = this.resolvePath();
        //@ts-ignore
        return ImportStaticAssets.readJsonFile(filePath);
    }

    protected static readJsonFile(path) {
        try {
            //const data = await import(path).then(module => module.default);
            return assets;
        } catch(e) {
            console.log(e)
        }

        return [];
    }
}