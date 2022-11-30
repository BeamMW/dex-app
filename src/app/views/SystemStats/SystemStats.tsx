import React, { useEffect, useRef, useState } from "react";
import { BeamIcon, EthIcon } from "@app/assets/icons";
import { styled } from "@linaria/react";
import { Flex, Text } from 'theme-ui'
import { Amount } from "@app/components/Amount/Amount";
import { Statistic } from "@app/components/Statistic/Statistic";
import useGetAvailableAssetsList from "@app/hooks/useGetAvailableAssetsList";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import { autorun, reaction, toJS, when } from "mobx";
import { getAssetTokFromPool } from "@app/utils/poolHelpers";
import { Decimal } from "@app/library/base/Decimal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
  margin-top: 10px;
  `;

const SystemStats: React.FC<any> = observer((props) => {

  const {fee, feeEqualized, selectedPairStore} = props;
  
  const availableAssets = useGetAvailableAssetsList();

  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);
  const [ratio, setRatio] = useState(null);

  useEffect(() => {
    const detach = reaction(() => selectedPairStore.currentPool, () => {
      //console.log("AUTORUN selectedPairStore.currentPool",toJS(selectedPairStore.currentPool));
      
      const from = _.find(availableAssets, (asset) => asset.asset_id === selectedPairStore.receiveAsset)
      const to = _.find(availableAssets, (asset) => asset.asset_id === selectedPairStore.sendAsset)
      
      const toTok = getAssetTokFromPool({pool: toJS(selectedPairStore.currentPool), assetId: selectedPairStore.receiveAsset})
      const fromTok = getAssetTokFromPool({pool: toJS(selectedPairStore.currentPool), assetId: selectedPairStore.sendAsset})
      
      const ratio = Decimal.from(fromTok).div(Decimal.from(toTok)).prettify(5).toString();

      setFromAsset(from);
      setToAsset(to);
      setRatio(ratio);
    });

    return () => {
      detach();
    }
  }, []);

  const isLoaded = fromAsset && toAsset && ratio;

  return (
      <Container>
        <Flex sx={{ mb: '20px' }}>
          {isLoaded ? <Amount size="20px" value='1' icon={fromAsset.icon} currency={fromAsset.title} /> : <></>}
          {isLoaded ? <Text sx={{ display: 'block', m: '5px 10px 0px 10px' }}> = </Text> : <></>}
          {isLoaded ? <Amount size="20px" value={ratio} icon={toAsset.icon} currency={toAsset.title} /> : <></>}
        </Flex>
        <Statistic
          name="Price Impact"
          tooltip="Price Impact"
        >
            0.0%
          </Statistic><Statistic
            name="Network fee"
            tooltip="Network fee"
          >
            {+fee} {feeEqualized ? <Text sx={{ color: 'rgba(255,255,255,0.5)', ml: '4px' }}>(0 USD)</Text> : <></>}
          </Statistic>
      </Container>
  )
})

export default SystemStats;