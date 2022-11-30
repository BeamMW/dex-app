import { Dictionary } from "typescript-collections"

export type RawAsset = {
    aid: number,
    mintedLo: number
    mintedHi: number,
    owner_cid: string,
    metadata: string
}

export interface IAssetMeta {
    get assetName(): string,
    get assetIconPath(): any,
    get assetDescription(): any,
}

export type Asset = {
    id: number,
    meta: IAssetMeta,
    raw?: RawAsset
}

export type AssetDictionary = Dictionary<number, Asset>