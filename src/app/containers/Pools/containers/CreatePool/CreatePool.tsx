import React, {useCallback, useEffect, useState} from "react";
import "./index.scss";
import {Button, Input, Title} from "@app/shared/components";
import { useSelector} from "react-redux";
import {selectAssetsList, selectTxStatus} from "@app/containers/Pools/store/selectors";
import Select from 'react-select'
import {IAsset, ICreatePool, ITxId, Kind, TxStatus} from "@core/types";
import {CreatePoolApi, LoadPoolsList} from "@core/api";
import {ROUTES_PATH} from "@app/shared/constants";
import {useNavigate} from "react-router-dom";
import {parsePoolMetadata} from "@core/appUtils";

export const CreatePool = () => {
  const assetsList = useSelector(selectAssetsList());
  const txStatus = useSelector(selectTxStatus());
  const [options, setOptions] = useState([])
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

  useEffect(()=>{
    checkTxStatus(txId, txStatus)
    // TODO: ADD onCheck all statuses
    if (codeStatus && codeStatus === TxStatus.Completed) {
      LoadPoolsList().then(res => {
        const newPoolList = res.map((pool)=>{
          return   parsePoolMetadata(pool,pool.aid1, pool.aid2, assetsList)
        })
        console.log(newPoolList)
        let newPool
        newPoolList.filter(item => {
          if(item.aid1 === requestData[0].aid1 && item.aid2 === requestData[0].aid2 && item.kind === requestData[0].kind){
            newPool = item
          }
        })
        addLiquidityNavigation(newPool)
      })
    }

  },[ codeStatus, txStatus])

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

  useEffect(()=>{
      setOptions(getOptions(assetsList))
  },[assetsList])

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
       CreatePoolApi(data).then((res: ITxId)=>{
        setTxId(res.txid)
      })
  }

  return (
    <div className="create-pool-wrapper">
      <Title variant="heading">Create Pool</Title>

      <div className="create-pool-assets-container">
        <Title variant="subtitle">Select Pair</Title>
        <div className="assets-selector-wrapper">
          <div className="asset-selector">
            <Input />
            <div className="select-wrapper">
              <Select  classNamePrefix="custom-select"
                       options={options}
                       onChange={onChangeToken1}
              />
            </div>
          </div>
          <div className="asset-selector">
            <Input />
            <div className="select-wrapper">
              <Select classNamePrefix="custom-select"
                      options={options}
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
