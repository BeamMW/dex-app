import React, {
  lazy,
  startTransition,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Flex, Box, Button} from "theme-ui";
import { PageTitle } from "@app/components/PageTitle/PageTitle";
import { SelectWithInput } from "@app/components/SelectWithInput/SelectWithInput";
import { ApproveIcon } from "@app/assets/icons";
import {
  Title,
  TitleContainer,
} from "@app/components/PageTitle/PageTitle.style";
import PriceAndShare from "@app/views/PriceAndShare/PriceAndShare";
import { useStoreAccessor } from "@app/contexts/Store/StoreAccessorContext";
import { Decimal } from "@app/library/base/Decimal";
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";
import {
  AssetInPool,
  Kind,
  ShaderTransactionComments,
} from "@app/library/dex/types";
import { IsTransactionStatus } from "@app/library/transaction-react/IsTransactionStatus";
import { DEFAULT_SENDER_ASSET } from "@app/constants";
import { observer, useLocalObservable } from "mobx-react-lite";
import useGetAvailableAssetsList from "@app/hooks/useGetAvailableAssetsList";
import { createTransformer } from "mobx-utils";
import useFilterSuitableAssets from "@app/hooks/useFilterSuitableAssets";
import { useAsync } from "react-async";
import useCalculateTradeOutput from "@app/hooks/useCalculateTradeOutput";
import { useDebounce } from "@app/hooks/useDebounce";
import { reaction, toJS, when } from "mobx";
import { fromGroths } from "@app/library/base/appUtils";
import useProcessAssetsForSelect from "@app/hooks/useProcessAssetsForSelect";
import useGetPoolContractInfo from "@app/hooks/useGetPoolContractInfo";
import useCheckProvidingLiquidityToPool from "@app/hooks/useCheckProvidingLiquidityToPool";
import useCalculateLiquidityForPoolAsset from "@app/hooks/useCalculateLiquidityForPoolAsset";
import { LiquidityAction } from "@app/views/Actions/LiquidityAction";
import { LoadingOverlay } from "@app/components/LoadingOverlay";
import { Asset } from "@app/library/base/assets/types";
import useGetAllAssetsList from "@app/hooks/useGetAllAssetsList";
import { assetsListError } from "@app/views/Validators/validatePool";
import _ from "lodash";
import KindSelect from "@app/components/KindSelect/KindSelect";
import { styled } from '@linaria/react';

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
  updatePoolSelectionProps: () => void;
};


const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
  margin-top: 10px;
  margin-right: 10px;

  > .manual-expand {
    display: flex;
    cursor: pointer;
    align-items: baseline;

    > .icon-expand {
      margin-left: auto;
    }
    > .icon-expand.expanded {
      transform: rotate(180deg);
    }
  }
  `;

  export const Label = styled.div`
    font-family: 'ProximaNova';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 3.11111px;
    height: 17px;
    text-transform: uppercase;
    color: #FFFFFF;
    
    &.error {
      color: rgba(255, 98, 92, 0.7);
    }
`

const ProvideLiquidity: React.FC<any> = observer(() => {
  const storeAccessor = useStoreAccessor();
  const [sending, setSending] = useState(Decimal.ZERO);
  const [currentEstimationShare, setCurrentEstimationShare] = useState(
    Decimal.ZERO
  );

  const myTransactionState = useCurrentTransactionState(
    new RegExp(`${ShaderTransactionComments.setAddLiquidity}`, "g")
  );
  const [isTransactionPending, isTransactionFailed, isTransactionSuccess] =
    IsTransactionStatus({
      transactionIdPrefix: ShaderTransactionComments.setAddLiquidity,
    });

  const [isPredictValid, setIsPredictValid] = useState(null);
  const [editedAmount, _setEditedAmount] = useState<Decimal>(Decimal.ZERO);

  const setEditedAmount = (value) => {
    value = Decimal.from(value).lte(Decimal.ZERO)
      ? Decimal.ZERO
      : Decimal.from(value);
    return _setEditedAmount(value);
  };

  const allPermittedAssets = useGetAllAssetsList();
  const allListedInPoolsAssets = useGetAvailableAssetsList();

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
    updatePoolSelectionProps() {
      this.error = null;

      this.currentCombination = { ...toJS(this.nextCombination) };
      this.nextCombination = null;
      console.log("updatePoolSelectionProps has updated");
    },
  }));

  const selectStore = useLocalObservable(() => ({
    fromAssets: allListedInPoolsAssets,
    toAssets: [],
    error: null,
    calculateToAssets(props: { assetId: number; kind: Kind }) {
      console.log("recalculate calculateToAssets");
      this.getUsedAssetsForToAssets(props);
      this.error = !this.toAssets.length ? assetsListError : null;
    },
    getUsedAssetsForToAssets(prop: { assetId: number; kind: Kind }) {
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
        .filter((asset: Asset) =>
          usedAssets.some((usedAsset: AssetInPool) => asset.id === usedAsset.id)
        )
        //for removing same asset id
        .filter((asset: Asset) => asset.id !== prop.assetId);
    },
  }));


  const selectedPool = useLocalObservable(() => ({
    currentPool: null,
    resolveCurrentPool(props: Combination) {
      console.log("resolveCurrentPool", toJS(props));
      this.currentPool = storeAccessor.poolsStore.resolvePoolByKindAssets({
        ...toJS(props),
      });
    },
  }));


  const serializedSelectedCombination = createTransformer(
    (combination: CombinationStore) => ({
      changingAsset: combination.nextCombination.assetA,
      kind: combination.nextCombination.kind,
    })
  );

  useEffect(() => {
    //on start
    const detachWhen = when(
      () => combinationStore.currentCombination === null,
      () => {
        console.log("On start when reaction has called once!");

        selectStore.getUsedAssetsForToAssets({
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
        combinationStore.updatePoolSelectionProps();

        selectedPool.resolveCurrentPool(toJS(combinationStore.currentCombination));
      }
    );

    const detachCombinationReaction = reaction(
      () => serializedSelectedCombination(combinationStore),
      (current, prev) => {
        if (current && !_.isEqual(current, prev)) {
          console.log("CombinationReaction!!!");
          combinationStore.updatePoolSelectionProps();

          if (!combinationStore.error) {
            selectStore.calculateToAssets({
              assetId: combinationStore.currentCombination.assetA.id,
              kind: combinationStore.currentCombination.kind,
            });

            selectedPool.resolveCurrentPool(
              combinationStore.currentCombination
            );
          }
        }
      }
    );

    return () => {
      console.log("Detached all reactions from PoolCreation");
      detachWhen();
      detachCombinationReaction();
    };
  }, []);

  const debouncedEditedAmount = useDebounce(editedAmount, 1);

  /* const sendingMemo = useMemo(
    () =>
    selectedPool.currentPool && useCalculateLiquidityForPoolAsset({
        pool: selectedPool.currentPool,
        fromAsset: combinationStore.currentCombination.assetB,
        toAsset: combinationStore.currentCombination.assetA,
        fromAmount: editedAmount,
      }),
    [selectedPool.currentPool, editedAmount]
  );

  const calculationOutput = useAsync({
    promiseFn: useCallback(
      () =>
        useCheckProvidingLiquidityToPool({
          fromAsset: combinationStore.currentCombination.assetA,
          toAsset: combinationStore.currentCombination.assetB,
          fromAmount: editedAmount,
          toAmount: sending,
        }),
      [combinationStore.currentCombination, sendingMemo]
    ),
  }); */

  /* useEffect(() => {
    setSending(sendingMemo);
  }, [editedAmount, sendingMemo]);

  useEffect(() => {
    setIsPredictValid(!!calculationOutput.data);

    console.log("calculationOutput.data", calculationOutput.data);

    if (calculationOutput.data) {
      const { ctl } = calculationOutput.data;
      setCurrentEstimationShare(Decimal.from(ctl));
    } else {
      setCurrentEstimationShare(Decimal.ZERO);
    }
  }, [calculationOutput.data]); */

  return (
    <>
      <PageTitle title="Add liquidity" />
      <Flex sx={{ flexWrap: "wrap" }}>
        <Flex sx={{ flex: "50%", justifyContent: "flex-end" }}>
          <Box sx={{ mr: "10px", minHeight: "149px" }}>
            <SelectWithInput
              label="Select deposit currency"
              inputColor="purple"
              optionsList={useProcessAssetsForSelect(selectStore.fromAssets)}
              onChange={(asset) => {
                combinationStore.updateCombination({
                  ...toJS(combinationStore.currentCombination),
                  assetA: toJS(asset),
                });
              }}
              setEditedAmount={
                setEditedAmount
                  ? (newValue) =>
                      setEditedAmount(
                        Decimal.from(!!newValue ? newValue : Decimal.ZERO)
                      )
                  : Decimal.from(0)
              }
              editedAmount={editedAmount}
            />
          </Box>
        </Flex>
        <Flex sx={{ flex: "50%" }}>
          <Box
            sx={{
              minHeight: "149px",
              width: "100%",
              maxWidth: "450px",
            }}
          >
            <SelectWithInput
              label="(estimated)"
              inputColor="blue"
              optionsList={useProcessAssetsForSelect(selectStore.toAssets)}
              readOnlyInput={true}
              editedAmount={sending}
              onChange={(asset) => {
                combinationStore.updateCombination({
                  ...toJS(combinationStore.currentCombination),
                  assetB: toJS(asset),
                });
              }}
            />
          </Box>
        </Flex>
        <Flex sx={{ flex: "50%" }}>
          <Box
            sx={{
              minHeight: "149px",
              width: "100%",
              maxWidth: "450px",
            }}
          >
            <Container>
                <Label sx={{marginBottom: 0, color: "#fff"}}>Reward</Label>
                <KindSelect onChange={
                  (event) => {
                    combinationStore.updateCombination({
                      ...toJS(combinationStore.currentCombination),
                      kind: +event.currentTarget.value,
                    });
                  }
                } />
            </Container>
          </Box>
        </Flex>
        {/* <Flex sx={{ flex: "50%" }}>
          <Box
            sx={{
              minHeight: "149px",
              width: "100%",
              maxWidth: "450px",
            }}
          >
            <PriceAndShare
              currentEstimationShare={currentEstimationShare}
              selectedPairStore={selectedPair}
            />
          </Box>
        </Flex>
        <Flex
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: "20px",
          }}
        >
          {isPredictValid && !editedAmount.isZero ? (
            <LiquidityAction
              transactionId={`${ShaderTransactionComments.setAddLiquidity} ${editedAmount} NPH`}
              fromAsset={selectedPair.sendAsset}
              toAsset={selectedPair.receiveAsset}
              fromAmount={editedAmount}
              toAmount={sending}
              disabled={isTransactionPending}
            >
              <Box sx={{ mr: "10px" }}>
                <ApproveIcon />
              </Box>
              add
            </LiquidityAction>
          ) : (
            <Button sx={{ background: "#00F6D2", opacity: 0.3 }}>
              <Box sx={{ mr: "10px" }}>
                <ApproveIcon />
              </Box>
              add
            </Button>
          )}
        </Flex> */}
      </Flex>
    </>
  );
});

export default ProvideLiquidity;
