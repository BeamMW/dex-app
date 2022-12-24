export type Pallete = 'green' | 'ghost' | 'purple' | 'blue' | 'red' | 'white' | 'vote-red';

export type ButtonVariant = 'regular' | 'ghost' | 'ghostBordered' | 'block' | 'link' | 'icon';

export interface IMetadataPairs {
    N: string;
    NTHUN?: string;
    SCH_VER?: string;
    SN: string;
    UN?: string;
    OPT_COLOR?: string;
}
export interface IAsset {
    aid: number,
    metadata: string,
    mintedHi: number,
    mintedLo: number,
    owner_pk: string,
    parsedMetadata: IMetadataPairs,
    limitHi?: number,
    limitLo?: number,
}

export interface IPoolCard {
    aid1: number,
    aid2: number,
    ctl: number,
    k1_2: string,
    k1_ctl: string,
    k2_1: string,
    k2_ctl: string,
    kind: number,
    lp_token: number,
    tok1: number,
    tok2: number,
}


export enum Kind {
    Low = 0,
    Mid = 1,
    High = 2,
}
