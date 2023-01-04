import React, {useCallback, useEffect, useState} from "react";
import "./index.scss";
import {Button, Input, Title} from "@app/shared/components";
import { useSelector} from "react-redux";
import {selectAssetsList, selectPoolsList, selectTxStatus} from "@app/containers/Pools/store/selectors";
import Select from 'react-select'
import {IAsset, ICreatePool, IError, ITxId, Kind, TxStatus} from "@core/types";
import {CreatePoolApi, LoadPoolsList} from "@core/api";
import {ROUTES_PATH} from "@app/shared/constants";
import {useNavigate} from "react-router-dom";
import {parsePoolMetadata} from "@core/appUtils";
import {actions} from "@app/containers/Pools/store";
import store from "../../../../../index";
import {toast} from "react-toastify";

export const CreatePool = () => {
  const assetsList = useSelector(selectAssetsList());
  const poolsList = useSelector(selectPoolsList());
  const txStatus = useSelector(selectTxStatus());
  const [options, setOptions] = useState([])
  const [options2pair, setOptions2Pair] = useState([])
  const [currentToken1, setCurrentToken1] = useState(null);
  const [currentToken2, setCurrentToken2] = useState(null);
  const [currentKind, setCurrentKind] = useState(null);
  const [isValidate, setIsValidate] = useState(false);
  const [txId, setTxId] = useState(null)
  const [codeStatus, setCodeStatus] = useState(null)

  const navigate = useNavigate()

  const requestData: ICreatePool[] = [{
    aid1: currentToken1,
    aid2 :currentToken2,
    kind: currentKind
  }]

  const kind = [
    {value: 0, label: Kind.Low},
    {value: 1, label: Kind.Mid},
    {value: 2, label: Kind.High}
  ]

  const addLiquidityNavigation = useCallback((state) => {
    navigate(ROUTES_PATH.POOLS.ADD_LIQUIDITY, {state});
  }, [navigate]);
  const addMainNavigation = useCallback(() => {
    navigate(ROUTES_PATH.POOLS.BASE);
  }, [navigate]);

  useEffect(()=>{
    checkTxStatus(txId, txStatus)
    if (codeStatus && codeStatus === TxStatus.Completed) {
      LoadPoolsList().then(res => {
        const newPoolList = res.map((pool)=>{
          return   parsePoolMetadata(pool,pool.aid1, pool.aid2, assetsList)
        })
        store.dispatch(actions.setPoolsList(newPoolList))
      })
    }  else if (codeStatus && codeStatus === TxStatus.Failed) {
      toast("Transaction is failed", {
        type:"error"
      })
      addMainNavigation()
    }
    else if (codeStatus && codeStatus === TxStatus.InProgress) {
      console.log('In progress')
    }

  },[ codeStatus, txStatus])

  useEffect(()=>{
    if(codeStatus && codeStatus === TxStatus.Completed){
      let newPool
      console.log(poolsList)
      poolsList.filter(item => {
        if(item.aid1 === requestData[0].aid1 && item.aid2 === requestData[0].aid2 && item.kind === requestData[0].kind){
          newPool = item
          console.log(item)
        }
      })
      addLiquidityNavigation(newPool)
    }
  },[poolsList])

  function checkTxStatus(txId:string, txList) {

      if(txList !== null) {
        txList.txs?.filter((item) => {
          if (item.txId === txId) {
            setCodeStatus(item.status)
          }
        })
      } else
        return  setCodeStatus(null)
  }

  const  getOptions =  (list: IAsset[]) => {
    let options = [{
      value: 0,
      label: 'BEAM'
    }]
    list.map(item => {
      options = [...options,  { value: item.aid, label: item.parsedMetadata.N}]
    })
    return options
  }
  const getOptionsSecondPare = (lists, value: number) =>{
    if(lists && value || value === 0){
        setOptions2Pair(lists.filter((item) => item.value > value))
    }
    return  lists
  }

  useEffect(()=>{
      setOptions(getOptions(assetsList))
  },[assetsList])

  useEffect(()=>{
    getOptionsSecondPare(options, currentToken1)
  },[ currentToken1])

  const onChangeToken1 = ( newValue) => {
    setCurrentToken1(newValue.value)
  }
  const onChangeToken2 = (newValue ) => {
    setCurrentToken2(newValue.value)
  }
  const onChangeKind = ( newValue) => {
    setCurrentKind(newValue.value)
  }

 const checkValidate = () => {
    requestData.map(item=> {
      if(item.aid1 !== null && item.aid2 !== null && item.kind !== null){
        return setIsValidate(true)
      }
      setIsValidate(false)
    })
 }
  useEffect(()=>{
    checkValidate()
  },[requestData])
  const onCreatePool =  (data) => {
       CreatePoolApi(data)
           .then((res: ITxId)=>{
        setTxId(res.txid)
      })
           .catch((error: IError)=>toast(error.error))
  }

  return (
    <div className="create-pool-wrapper">
      <Title variant="heading">Create Pool</Title>

      <div className="create-pool-assets-container">
        <Title variant="subtitle">Select Pair</Title>
        <div className="assets-selector-wrapper">
          <div className="asset-selector">
            {/*<Input />*/}
            <div className="select-wrapper">
              <Select  classNamePrefix="custom-select"
                       options={options}
                       onChange={onChangeToken1}
              />
            </div>
          </div>
          <div className="asset-selector">
            {/*<Input />*/}
            <div className="select-wrapper">
              <Select classNamePrefix="custom-select"
                      options={options2pair}
                      onChange={onChangeToken2}
              />
            </div>
          </div>
        </div>
        <div className="price-wrapper">
          <div className="price-title">Price:</div>
          <div className="price-value">xxxxxx</div>
        </div>

        <div className="fees-container">
          <Title variant="subtitle">Choose fee tier</Title>
          <div className="fees-wrapper">
            <div className="information">
              Fee tier indicates the liquidity of the pool assets. It is
              recommended to use low tier for stable assets only.
            </div>
            <Select
                classNamePrefix="custom-select"
                options={kind} placeholder='Select fee'
                onChange={onChangeKind}
            />
          </div>
        </div>

        <div className="button-wrapper">
          <Button  onClick={()=>onCreatePool(requestData)} disabled={!isValidate}>Create Pool</Button>
        </div>
      </div>
    </div>
  );
};
