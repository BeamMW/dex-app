import React, {useMemo, useState} from 'react';
import "./index.scss";
import {useLocation} from "react-router";
import {IAddLiquidity, IAsset, IError, IPoolCard} from "@core/types";
import {Button, Input, Title} from "@app/shared/components";
import {toGroths} from "@core/appUtils";
import {useDispatch, useSelector} from "react-redux";
import * as mainActions from "@app/containers/Pools/store/actions";
import {toast} from "react-toastify";
import {selectErrorMessage} from "@app/containers/Pools/store/selectors";

export const AddLiquidity = () => {
    const data:IPoolCard = useLocation().state as IPoolCard
    const error = useSelector(selectErrorMessage());
    const defaultLiquidity:IAddLiquidity= {
        "aid1": data.aid1,
        "aid2": data.aid2,
        "kind": data.kind,
        "val1": 0,
        "val2": 0,
        "bPredictOnly": 0
    }
    const [addLiquidity, setAddLiquidity] = useState<IAddLiquidity>(defaultLiquidity);
    const dispatch = useDispatch()

    useMemo(()=>{
        if(error) {
            toast(error)
        }

    },[!error])

    const onChangeValue = (value, aid) => {
        if(aid === 'aid1'){
            setAddLiquidity({...addLiquidity, val1: toGroths(value)})
        } else if( aid === 'aid2'){
            setAddLiquidity({...addLiquidity, val2: toGroths(value)})
        }
    }
    const onAddLiquidity = (data:IAddLiquidity):void => {
        dispatch(mainActions.onAddLiquidity.request(data))
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
                           <span className="select-content"> {data.metadata1.N}</span>
                        </div>
                    </div>
                    <div className="asset-selector">
                        <Input type='number' defaultValue={addLiquidity.val1} onChange={(e)=>onChangeValue(e.target.value, 'aid2')} />
                        <div className="select-wrapper">
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
