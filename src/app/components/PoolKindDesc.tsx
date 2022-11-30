import { Kind } from "@app/library/dex/types";
import React from "react";
import { Text } from "theme-ui";

export const useGetPoolKindDesc = ({kind}: {kind: Kind | number}) => {
    let kindDesc = null;

    if(kind === Kind.Low) 
        kindDesc = "0.05%";

    if(kind === Kind.Mid) 
        kindDesc = "0.3%";
    
    if(kind === Kind.High) 
        kindDesc = "1%";

    return kindDesc;
}



export const PoolKindDescText: React.FC<{kind: Kind | number}> = ({kind}) => {
    const kindDesc = useGetPoolKindDesc({kind});
    return (kindDesc ? <Text> kind: {kindDesc} </Text> : <></>);
};