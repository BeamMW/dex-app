import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Flex, Box, Button } from 'theme-ui';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { TabsContainer } from '@app/views/navTabs/Tabs.style';
import { SelectWithInput } from '@app/components/SelectWithInput/SelectWithInput';
import TransactionSettings from '@app/views/transactionSettings/transactionSettings';
import SystemStats from '@app/views/SystemStats/SystemStats';
import { ApproveIcon } from '@app/assets/icons';
import { Title, TitleContainer } from '@app/components/PageTitle/PageTitle.style';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStoreAccessor } from '@app/contexts/Store/StoreAccessorContext';
import { DEFAULT_SENDER_ASSET } from '@app/constants';
import useGetDefaultAssetPair from '@app/hooks/useGetDefaultAssetPair';
import { autorun, reaction, toJS, when } from 'mobx';
import useFilterSuitableAssets from '@app/hooks/useFilterSuitableAssets';
import useGetAvailableAssetsList from '@app/hooks/useGetAvailableAssetsList';
import { Decimal } from '@app/library/base/Decimal';
import { createTransformer } from 'mobx-utils';
import { useAsync } from 'react-async';
import useCalculateTradeOutput from '@app/hooks/useCalculateTradeOutput';
import { useDebounce } from '@app/hooks/useDebounce';
import { TradeAction } from '@app/views/Actions/TradeAction';
import { useCurrentTransactionState } from '@app/library/transaction-react/useCurrentTransactionState';
import { ShaderTransactionComments } from '@app/library/dex/types';
import { IsTransactionStatus } from '@app/library/transaction-react/IsTransactionStatus';
import { fromGroths } from '@app/library/base/appUtils';
import useProcessAssetsForSelect from '@app/hooks/useProcessAssetsForSelect';
import useGetPoolContractInfo from '@app/hooks/useGetPoolContractInfo';

const Trading: React.FC<{children?: React.ReactNode;}> = observer(({children}) => {
 
  const storeAccessor = useStoreAccessor();
  //const fee = useRef(Decimal.ZERO);
  //const sending = useRef(Decimal.ZERO);
  const [fee, setFee] = useState(Decimal.ZERO);
  const [sending, setSending] = useState(Decimal.ZERO);

  const myTransactionState = useCurrentTransactionState(new RegExp(`${ShaderTransactionComments.setTrade}`, "g"));
  const [isTransactionPending, isTransactionFailed, isTransactionSuccess] = IsTransactionStatus({ transactionIdPrefix: ShaderTransactionComments.setTrade });

  const [isPredictValid, setIsPredictValid] = useState(null);
  const [editedAmount, _setEditedAmount] = useState<Decimal>(Decimal.ZERO);

  const setEditedAmount = (value) => {
    value = Decimal.from(value).lte(Decimal.ZERO) ? Decimal.ZERO : Decimal.from(value);
    return _setEditedAmount(value);
  }

  //error: geting after first select :()
  //const {sender, receiver} = useGetDefaultAssetPair();
  
  const senderAsset = DEFAULT_SENDER_ASSET
  const receiverAsset = storeAccessor.poolsStore.uniquePoolsPairs.get(DEFAULT_SENDER_ASSET)[0]

  const selectedPair = useLocalObservable(() => ({
      sendAsset: senderAsset,
      receiveAsset: receiverAsset,
      currentPool: null,
      setPairs({sender,receiver}) {
          this.sendAsset = sender
          this.receiveAsset = receiver
      },
      updateBySendAsset({asset}) {
        this.sendAsset = asset;
        this.receiveAsset = storeAccessor.poolsStore.uniquePoolsPairs.get(asset)[0];
      },
      resolveCurrentPool() {
        //console.log("this.senderAsset, this.receiverAsset",this.sendAsset, this.receiveAsset,storeAccessor.poolsStore.resolvePoolByAssets(this.sendAsset, this.receiveAsset));
        this.currentPool = storeAccessor.poolsStore.resolvePoolByAssets(this.sendAsset, this.receiveAsset);
      }
  }));

  const assets = useProcessAssetsForSelect(
    useGetAvailableAssetsList()
  );

  const receiverAssets = useProcessAssetsForSelect(
    useFilterSuitableAssets({choosenAsset: selectedPair.sendAsset})
  );

  const serializedselectedPair = createTransformer((selectedPair: any) => ({
    send: selectedPair.sendAsset,
    receive: selectedPair.receiveAsset,
  }));

  const debouncedEditedAmount = useDebounce(editedAmount, 1)

  const calculationOutput = useAsync({
    promiseFn: useCallback(() => useCalculateTradeOutput({
      sendingAsset: selectedPair.sendAsset, 
      receivingAsset: selectedPair.receiveAsset,
      sendingAmount: editedAmount
    }), [selectedPair.sendAsset, selectedPair.receiveAsset, editedAmount])
  })

  const isPoolExists = useAsync({
    promiseFn: useCallback(() => useGetPoolContractInfo({
      sendingAsset: selectedPair.sendAsset, 
      receivingAsset: selectedPair.receiveAsset,
    }), [selectedPair.sendAsset, selectedPair.receiveAsset])
  })

  useEffect(() => {
    //first loading resolve pool
    selectedPair.resolveCurrentPool();

    //resolve pool on every asset change
    const detach = reaction(() => serializedselectedPair(selectedPair), ()=> {
      selectedPair.resolveCurrentPool();
      setEditedAmount(0);
    });

    return () => {
      detach();
    }
  }, []);

  useEffect(() => {
    setIsPredictValid(!!calculationOutput.data)

    if(calculationOutput.data) {
      const {"fee-pool": feePool, "fee-dao": feeDao, "pay-raw": payRaw} = calculationOutput.data;
      
      setFee(Decimal.from(fromGroths(feePool)).add(fromGroths(feeDao)));
      setSending(Decimal.from(fromGroths(payRaw)));
    } else {
      setFee(Decimal.ZERO);
      setSending(Decimal.ZERO);
    }

  }, [calculationOutput.data])


  return (
    <>
    <TitleContainer>
      <Title>
      swap tokens
      </Title>
    </TitleContainer>
    <TabsContainer/>
    <Flex sx={{ flexWrap: 'wrap' }}>
      <Flex sx={{ flex: '50%', justifyContent: 'flex-end' }}>
        <Box sx={{mr: '10px'}}>
        <SelectWithInput 
          label='Send amount  (estimated)' 
          inputColor='blue' 
          optionsList={receiverAssets}
          readOnlyInput={true}
          editedAmount={sending}
          onChange={(asset) => {
            selectedPair.receiveAsset = asset;
          }} />
        </Box>
      </Flex>
      <Flex sx={{ flex: '50%' }}>
        <Box>
        <SelectWithInput
           label='Receive Amount' 
           inputColor='purple' 
           optionsList={assets} 
           onChange={(asset) => {
            selectedPair.updateBySendAsset({asset})
          }}
          setEditedAmount={
            setEditedAmount
              ? newValue =>
                setEditedAmount(Decimal.from(!!newValue ? newValue : Decimal.ZERO))
              : Decimal.from(0)
          }
          editedAmount={editedAmount}
          />
        </Box>
      </Flex>
      <Flex sx={{ flex: '50%', justifyContent: 'flex-end' }}>
        <Box sx={{
              width: '100%',
              maxWidth: '450px',
              mr: '10px',          
        }}>
          {/* <TransactionSettings /> */}
        </Box>
      </Flex>

      <Flex sx={{ flex: '50%' }}>
        <Box sx={{
              width: '100%',  
              maxWidth: '450px',
        }}>
          <SystemStats fee={fee} feeEqualized={null} selectedPairStore={selectedPair} />
        </Box>
      </Flex>

      <Flex sx={{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        mt: '40px'
      }}>
        {isPoolExists && isPredictValid && !editedAmount.isZero ? (
            <TradeAction
              transactionId={`${ShaderTransactionComments.setTrade} ${editedAmount} NPH`}
              sendingAsset={selectedPair.sendAsset}
              receivingAsset={selectedPair.receiveAsset}
              sendingAmount={editedAmount}
              disabled={isTransactionPending}
            >
              <Box sx={{mr: '10px'}}>
                <ApproveIcon />
              </Box>
                Swap
            </TradeAction>
          ) : (
            <Button sx={{ background: '#00F6D2', opacity: 0.3 }}>
              <Box sx={{mr: '10px'}}>
                <ApproveIcon />
              </Box>
                Swap
            </Button>
          )}
        
      </Flex>
    </Flex>
    </>
  );
})

export default Trading;