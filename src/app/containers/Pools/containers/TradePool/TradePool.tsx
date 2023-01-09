import React, {useEffect, useState} from "react"
import { IPoolCard, ITrade} from "@core/types";
import {useLocation} from "react-router";
import {TradePoolApi} from "@core/api";
import {toGroths} from "@core/appUtils";
import {Button, Input, Title} from "@app/shared/components";
import Select from "react-select";
import {useInput} from "@app/shared/hooks";
import './index.scss'


export const TradePool = () => {
    const data:IPoolCard = useLocation().state as IPoolCard

    const [options, setOptions] = useState([])
    const [currentToken, setCurrentToken] = useState(data.aid1)
    const [amount, setAmount] = useState(0)
    const amountInput = useInput(amount)
    const onChangeToken = (newValue) => {
            setCurrentToken(newValue.value)
    }

    console.log(data)
    useEffect(()=>{
        setOptions([
            {label: data.metadata1.N, value: data.aid1},
            {label: data.metadata2.N, value: data.aid2}
        ])
    },[])

    const defaultLiquidity:ITrade= {
        "aid1": currentToken,
        "aid2": currentToken === data.aid1 ? data.aid2 : data.aid1,
        "kind": data.kind,
        "val1_buy": toGroths(Number(amountInput.value)),
        "bPredictOnly": 0
    }
    console.log(defaultLiquidity)
    const onTrade = (data: ITrade) =>{
        TradePoolApi(data).then(e=>console.log({e})).catch(e=>console.log(e))
    }
    return (
        <div className="create-pool-wrapper">
            <Title variant="heading">Trade</Title>
            <div className="create-pool-assets-container">
                <Title variant="subtitle">Select token</Title>
                <div className="assets-selector-wrapper">
                    <div className="asset-selector">
                        <Input type='number' value={amountInput.value} onChange={(e)=>amountInput.onChange(e)} />
                        <div className="select-wrapper">
                            <Select  classNamePrefix="custom-select"
                                     options={options}
                                     onChange={onChangeToken}
                            />
                            {/*<span className="select-content"> {data.metadata1.N}</span>*/}
                        </div>
                    </div>
                    </div>
                </div>
                <div className="amount-wrapper">
                    <div className="amount-title">{data.metadata1.N}:</div>
                    <div className="amount-value">{data.tok1}</div>
                </div>
            <div className="amount-wrapper">
                    <div className="amount-title">{data.metadata2.N}:</div>
                    <div className="amount-value">{data.tok2}</div>
            </div>
                <div className="button-wrapper">
                    <Button  onClick={()=>onTrade(defaultLiquidity)} >Add Liquidity</Button>
                </div>
            </div>
    )
}
