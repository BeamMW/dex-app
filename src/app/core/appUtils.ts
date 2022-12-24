import {IAsset, Kind} from "@core/types";
import {GROTHS_IN_BEAM} from "@app/shared/constants";


const beam = "BEAM"

export function parseMetadata(metadata) {
    const splittedMetadata = metadata.split(';');
    splittedMetadata.shift();
    const obj = splittedMetadata.reduce((accumulator, value, index) => {
        const data = value.split(/=(.*)/s);
        return {...accumulator, [data[0]]: data[1]};
    }, {});
    return obj;
}

export const getPoolKind = (kind: number) => {
    let kindDesc = null;

    if(kind === Kind.Low)
        kindDesc = "0.05%";

    if(kind === Kind.Mid)
        kindDesc = "0.3%";

    if(kind === Kind.High)
        kindDesc = "1%";

    return kindDesc;
}

export const getNameToken = (aid, assetList: IAsset[]): void =>{

    let nameToken
     if(aid === 0) {
         nameToken = beam
     } else  assetList.filter((item)=> {
        if(aid === item.aid){
            nameToken = item.parsedMetadata.UN
        }
    })
    return nameToken

}

export function fromGroths(value: number): number {
    return value && value !== 0 ? value / GROTHS_IN_BEAM : 0;
}

export function toGroths(value: number): number {
    const val = Number(parseFloat((value * GROTHS_IN_BEAM).toString()).toPrecision(12));
    return value > 0 ? Math.floor(val) : 0;
}
