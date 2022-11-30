import { AssetsRegistry } from "@app/library/base/assets/AssetsRegistry";
import { useState } from "react";
import _ from "lodash";
import { Asset } from "@app/library/base/assets/types";

const useGetAllAssetsList = (): Asset[] => {
    const assets = AssetsRegistry.getRegistry().values();
    return _(assets).sortBy(asset => asset.id).value();
}

export default useGetAllAssetsList;