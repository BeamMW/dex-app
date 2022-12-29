import React from "react";
import "./index.scss";
import { Title, Input, Select, Option, Button } from "@app/shared/components";
import {useSelector} from "react-redux";
import {selectAssetsList} from "@app/containers/Pools/store/selectors";
export const CreatePool = () => {

  const assetsList = useSelector(selectAssetsList());

  return (
    <div className="create-pool-wrapper">
      <Title variant="heading">Create Pool</Title>

      <div className="create-pool-assets-container">
        <Title variant="subtitle">Select Pair</Title>
        <div className="assets-selector-wrapper">
          <div className="asset-selector">
            <Input />
            <div className="select-wrapper"></div>
          </div>
          <div className="asset-selector">
            <Input />
            <div className="select-wrapper"></div>
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
            <Select value={0} onSelect={() => {}}>
              <Option key={0} value={0}>
                <span>0.3 percent (recommended)</span>
              </Option>
              <Option key={0} value={0}>
                <span>0.3 percent (recommended)</span>
              </Option>
              <Option key={0} value={0}>
                <span>0.3 percent (recommended)</span>
              </Option>
            </Select>
          </div>
        </div>

        <div className="button-wrapper">
          <Button>Create Pool</Button>
        </div>
      </div>
      {
       <ul>
         {assetsList.map((el) => (
             <li
               >
               {el.parsedMetadata.N}
             </li>
         ))}
       </ul>
      }
    </div>
  );
};
