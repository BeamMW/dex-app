import { LoadingBlock } from "@app/components/LoadingBlock";
import {
  Title,
  TitleContainer,
} from "@app/components/PageTitle/PageTitle.style";
import { useGetPoolKindDesc } from "@app/components/PoolKindDesc";
import { SelectWithInput } from "@app/components/SelectWithInput/SelectWithInput";
import { DEFAULT_SENDER_ASSET } from "@app/constants";
import { useStoreAccessor } from "@app/contexts/Store/StoreAccessorContext";
import useFilterSuitableAssets from "@app/hooks/useFilterSuitableAssets";
import useGetAllAssetsList from "@app/hooks/useGetAllAssetsList";
import useGetAvailableAssetsList from "@app/hooks/useGetAvailableAssetsList";
import useProcessAssetsForSelect from "@app/hooks/useProcessAssetsForSelect";
import { Asset } from "@app/library/base/assets/types";
import { Decimal } from "@app/library/base/Decimal";
import {
  AssetInPool,
  Kind,
  ShaderTransactionComments,
} from "@app/library/dex/types";
import { TabsContainer } from "@app/views/navTabs/Tabs.style";
import {
  assetsListError,
  validatePool,
} from "@app/views/Validators/validatePool";
import { autorun, reaction, toJS, when } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { createTransformer } from "mobx-utils";
import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Select, Text } from "theme-ui";
import _ from "lodash";
import { CreatePoolAction } from "@app/views/Actions/CreatePoolAction";
import { IsTransactionStatus } from "@app/library/transaction-react/IsTransactionStatus";
import { ApproveIcon } from "../../../../html/app/assets/icons";
import KindSelect from "@app/components/KindSelect/KindSelect";

type Combination = {
  assetA: Asset;
  assetB: Asset;
  kind: Kind;
};

type CombinationStore = {
  isLoading: boolean;
  currentCombination: Combination;
  nextCombination: Combination;
  error: null | any;
  updateIsLoading: (loading: boolean) => void;
  updateCombination: (props: Combination) => void;
  updatePoolCreationProps: () => void;
};

const PoolCreation: React.FC<any> = observer(() => {
  const storeAccessor = useStoreAccessor();
  const uniquePoolsPairs = storeAccessor.poolsStore.uniquePoolsPairs;

  /* const [fromEditedAmount, _setFromEditedAmount] = useState<Decimal>(Decimal.ZERO);
    const [toEditedAmount, _setToEditedAmount] = useState<Decimal>(Decimal.ZERO); */
  const [isTransactionPending, isTransactionFailed, isTransactionSuccess] =
    IsTransactionStatus({
      transactionIdPrefix: ShaderTransactionComments.setCreatePool,
    });

  /* const setFromEditedAmount = (value) => {
      value = Decimal.from(value).lte(Decimal.ZERO) ? Decimal.ZERO : Decimal.from(value);
      return _setFromEditedAmount(value);
    }

    const setToEditedAmount = (value) => {
      value = Decimal.from(value).lte(Decimal.ZERO) ? Decimal.ZERO : Decimal.from(value);
      return _setToEditedAmount(value);
    } */

  const allPermittedAssets = useGetAllAssetsList();

  const combinationStore: CombinationStore = useLocalObservable(() => ({
    isLoading: true,
    currentCombination: null,
    nextCombination: null,
    error: null,
    updateIsLoading(status: boolean) {
      this.isLoading = status;
    },
    updateCombination(props: Combination) {
      console.log("updating combination with props:", props);
      this.nextCombination = { ...props };
    },
    updatePoolCreationProps() {
      this.error = validatePool({
        storeAccessor,
        ...this.nextCombination,
      });

        this.currentCombination = { ...toJS(this.nextCombination) };
        this.nextCombination = null;
        console.log("updatePoolCreationProps has updated");
    },
  }));

  const selectStore = useLocalObservable(() => ({
    fromAssets: allPermittedAssets,
    toAssets: [],
    error: null,
    calculateToAssets(props: { assetId: number; kind: Kind }) {
      console.log("recalculate calculateToAssets");
      this.getNotUsedAssetsForToAssets(props);
      this.error = !this.toAssets.length ? assetsListError : null;
    },
    getNotUsedAssetsForToAssets(prop: { assetId: number; kind: Kind }) {
      const uniquePoolsPairs = storeAccessor.poolsStore.uniquePoolsPairs;
      const usedAssets = _.flatten(uniquePoolsPairs.getValue(prop));
      console.log(
        "prop",
        prop,
        "uniquePoolsPairs",
        uniquePoolsPairs.getValue(prop),
        uniquePoolsPairs
      );
      console.log("usedAssets", usedAssets);
      this.toAssets = allPermittedAssets
        .filter(
          (asset: Asset) =>
            !usedAssets.some(
              (usedAsset: AssetInPool) => asset.id === usedAsset.id
            )
        )
        //for removing same asset id
        .filter((asset: Asset) => asset.id !== prop.assetId);
    },
  }));

  const serializedSelectedCombination = createTransformer(
    (combination: CombinationStore) => combination.nextCombination
  );

  useEffect(() => {
    //on start
    const detachWhen = when(
      () => serializedSelectedCombination(combinationStore) === null,
      () => {
        console.log("On start when reaction has called once!");

        selectStore.getNotUsedAssetsForToAssets({
          assetId: allPermittedAssets[0].id,
          kind: Kind.Low,
        });

        combinationStore.updateCombination({
          assetA: selectStore.fromAssets[0],
          assetB: selectStore.toAssets[0],
          kind: Kind.Low,
        });

        combinationStore.updateIsLoading(false);
      }
    );

    when(
      () => !combinationStore.isLoading,
      () => {
        combinationStore.updatePoolCreationProps();
      }
    );

    const detachCombinationReaction = reaction(
      () => combinationStore.nextCombination,
      (current, prev) => {
        if (current && !_.isEqual(current, prev)) {
          console.log("CombinationReaction!!!");
          combinationStore.updatePoolCreationProps();

          !combinationStore.error && selectStore.calculateToAssets({
            assetId: combinationStore.currentCombination.assetA.id,
            kind: combinationStore.currentCombination.kind,
          });
        }
      }
    );

    return () => {
      console.log("Detached all reactions from PoolCreation");
      detachWhen();
      detachCombinationReaction();
    };
  }, []);

  useEffect(() => {
    if(isTransactionSuccess) {
      console.log("reload all assets!");
      storeAccessor.poolsStore.reloadPoolAssets();
    }
  }, [isTransactionSuccess])

  return (
    <>
      <TitleContainer>
        <Title>Create Pool</Title>
      </TitleContainer>
      <TabsContainer />
      {
        /* selectStore.fromAssets.length && selectStore.toAssets.length */ true ? (
          <Flex sx={{ flexWrap: "wrap", flexDirection: "column", maxWidth: "32rem", marginLeft:"auto",marginRight:"auto" }}>
              <Flex sx={{justifyContent:"space-between"}}>
                <Flex>
                  <Box sx={{minWidth:"15rem"}}>
                    <SelectWithInput
                      label="Select Asset From"
                      inputColor="purple"
                      optionsList={useProcessAssetsForSelect(
                        selectStore.fromAssets
                      )}
                      onChange={(asset) => {
                        combinationStore.updateCombination({
                          ...toJS(combinationStore.currentCombination),
                          assetA: toJS(asset),
                        });
                      }}
                      isInputVisible={false}
                      /* setEditedAmount={
                      setFromEditedAmount
                        ? newValue =>
                        setFromEditedAmount(Decimal.from(!!newValue ? newValue : Decimal.ZERO))
                        : Decimal.from(0)
                    }
                    editedAmount={fromEditedAmount} */
                    />
                  </Box>
                </Flex>
                
                <Flex>
                  <Box sx={{minWidth:"15rem"}}>
                    <SelectWithInput
                      label="Select Asset To"
                      inputColor="purple"
                      optionsList={useProcessAssetsForSelect(
                        selectStore.toAssets
                      )}
                      onChange={(asset) => {
                        combinationStore.updateCombination({
                          ...toJS(combinationStore.currentCombination),
                          assetB: toJS(asset),
                        });
                      }}
                      isInputVisible={false}
                      /* setEditedAmount={
                      setToEditedAmount
                        ? newValue =>
                        setToEditedAmount(Decimal.from(!!newValue ? newValue : Decimal.ZERO))
                        : Decimal.from(0)
                    }
                    editedAmount={toEditedAmount} */
                    />
                  </Box>
                
                </Flex>
              </Flex>
              <Flex sx={{flexDirection: "column", mt: "2rem"}}>
                <Heading variant="text">Choose fee tier</Heading>
                <Flex sx={{flexDirection:"column", padding: "1rem", mt:"0.5rem", borderRadius:"10px", border: "1px solid #1e2934"}}>
                  <Text >
                    Choose fee tier Fee tier indicates the liquidity of the pool
                    assets. It is recommended to use low tier for to stable
                    assets only
                  </Text>
                  <KindSelect onChange={
                    (event) => {
                      combinationStore.updateCombination({
                        ...toJS(combinationStore.currentCombination),
                        kind: +event.currentTarget.value,
                      });
                    }
                  }/>
                </Flex>
              </Flex>

            <Flex sx={{flexDirection:"column", mb:"1rem"}}>
              {combinationStore.error}
              {selectStore.error}
            </Flex>

            <Flex
              sx={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                mt: "40px",
              }}
            >
              {!combinationStore.isLoading ? (
                <CreatePoolAction
                  transactionId={`${ShaderTransactionComments.setTrade}`}
                  assetA={combinationStore.currentCombination.assetA}
                  assetB={combinationStore.currentCombination.assetB}
                  /* amountAssetA={fromEditedAmount}
                    amountAssetB={toEditedAmount} */
                  poolType={combinationStore.currentCombination.kind}
                  disabled={
                    isTransactionPending /* || fromEditedAmount.isZero || toEditedAmount.isZero */ ||
                    combinationStore.error ||
                    selectStore.error
                  }
                >
                  <Box sx={{ mr: "10px" }}>
                    <ApproveIcon />
                  </Box>
                  Create Pool 
                </CreatePoolAction>
              ) : (
                <></>
              )}
            </Flex>
          </Flex>
        ) : (
          <LoadingBlock />
        )
      }
    </>
  );
});

export default PoolCreation;
