import { DEFAULT_SENDER_ASSET } from "@app/constants";
import { useStoreAccessor } from "@app/contexts/Store/StoreAccessorContext";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

function useGetDefaultAssetPair (): {sender: number, receiver: number} {
    const storeAccessor = useStoreAccessor();
  
    const sender = useRef<number>(null)
    const receiver = useRef<number>(null)

    useEffect(() => {
      const dispose = autorun(() => {
        console.log("into useGetDefaultAssetPair autorun", storeAccessor.poolsStore.uniquePoolsPairs);
        if(storeAccessor.poolsStore.uniquePoolsPairs.has(DEFAULT_SENDER_ASSET)) {
            sender.current = DEFAULT_SENDER_ASSET
            receiver.current = storeAccessor.poolsStore.uniquePoolsPairs.get(DEFAULT_SENDER_ASSET)[0]
        } else {
            const firstPair = [...storeAccessor.poolsStore.uniquePoolsPairs][0];
            sender.current = firstPair[0];
            receiver.current = firstPair[1][0];
        }
      });
      console.log(sender.current, receiver.current);
      return () => {
        dispose();
      }
    }, []);
  
    return {sender: sender.current, receiver: receiver.current};
}


export default useGetDefaultAssetPair;