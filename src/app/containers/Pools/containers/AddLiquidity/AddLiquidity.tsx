import React, { useState} from 'react';
import "./index.scss";
import {useLocation} from "react-router";
import {IAddLiquidity, IAsset, IError, IPoolCard} from "@core/types";
import {Button, Input, Title} from "@app/shared/components";
import {AddLiquidityApi} from "@core/api";
import {toGroths} from "@core/appUtils";
import {toast} from "react-toastify";

export const AddLiquidity = () => {
    const data:IPoolCard = useLocation().state as IPoolCard
    console.log(data)
    const defaultLiquidity:IAddLiquidity= {
        "aid1": data.aid1,
        "aid2": data.aid2,
        "kind": data.kind,
        "val1": 0,
        "val2": 0,
        "bPredictOnly": 0
    }
    const [addLiquidity, setAddLiquidity] = useState<IAddLiquidity>(defaultLiquidity);
    console.log(addLiquidity)
    const onChangeValue = (value, aid) => {
        if(aid === 'aid1'){
            setAddLiquidity({...addLiquidity, val1: toGroths(value)})
        } else if( aid === 'aid2'){
            setAddLiquidity({...addLiquidity, val2: toGroths(value)})
            console.log(addLiquidity)
        }
    }
    const onAddLiquidity = (data:IAddLiquidity):void => {
        AddLiquidityApi(data).then(e=>console.log(e))
            .catch((error: IError)=>toast(error.error))
    }

    return (
        <div className="create-pool-wrapper">
            <Title variant="heading">Add Liquidity</Title>
            <div className="create-pool-assets-container">
                <Title variant="subtitle">Select Pair</Title>
                <div className="assets-selector-wrapper">
                    <div className="asset-selector">
                        <Input type='number' defaultValue={addLiquidity.val1} onChange={(e)=>onChangeValue(e.target.value, 'aid1')} />
                        <div className="select-wrapper">
                            {/*<Select  classNamePrefix="custom-select"*/}
                            {/*         options={options}*/}
                            {/*         onChange={onChangeToken1}*/}
                            {/*/>*/}
                           <span className="select-content"> {data.metadata1.N}</span>
                        </div>
                    </div>
                    <div className="asset-selector">
                        <Input type='number' defaultValue={addLiquidity.val1} onChange={(e)=>onChangeValue(e.target.value, 'aid2')} />
                        <div className="select-wrapper">
                            {/*<Select classNamePrefix="custom-select"*/}
                            {/*        options={options}*/}
                            {/*        onChange={onChangeToken2}*/}
                            {/*/>*/}
                            <span className="select-content"> {data.metadata2.N}</span>
                        </div>
                    </div>
                </div>
                <div className="price-wrapper">
                    <div className="price-title">Price:</div>
                    <div className="price-value">xxxxxx</div>
                </div>

                <div className="button-wrapper">
                    <Button  onClick={()=>onAddLiquidity(addLiquidity)} >Add Liquidity</Button>
                </div>
            </div>
        </div>
    );



};
