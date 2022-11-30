import React, { useEffect, useState } from "react";
import { styled } from "@linaria/react";
import { ExpendIcon } from "@app/assets/icons";
import { Label } from "@app/components/SelectWithInput/Select.style";
import { Statistic } from "@app/components/Statistic/Statistic";
import { Flex } from "theme-ui";
import { InputWithIcon } from "@app/InputWithIcon/InputWithIcon";
import { observer } from "mobx-react-lite";
import useGetAvailableAssetsList from "@app/hooks/useGetAvailableAssetsList";
import { reaction, toJS } from "mobx";
import { Decimal, Percent } from "@app/library/base/Decimal";
import { getAssetTokFromPool } from "@app/utils/poolHelpers";
import _ from "lodash";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 20px;
  margin-top: 10px;

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
  
  
const ExpandedContent = styled.div`
  margin-top: 20px;
  > .sub-link {
    margin-top: 10px;
  }
  `;

const PriceAndShare: React.FC<any> = observer((props) => {
  const {currentEstimationShare, selectedPairStore} = props;
  const [isExpanded, setIsExpanded] = React.useState(false);

  const availableAssets = useGetAvailableAssetsList();

  const [calculatedShare, setCalculatedShare] = useState(null);
  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);

  const [fromTok, setFromTok] = useState<Decimal>(Decimal.ZERO);
  const [toTok, setToTok] = useState<Decimal>(Decimal.ZERO);

  useEffect(() => {
    const detach = reaction(() => selectedPairStore.currentPool, () => {
      
      const from = _.find(availableAssets, (asset) => asset.asset_id === selectedPairStore.receiveAsset)
      const to = _.find(availableAssets, (asset) => asset.asset_id === selectedPairStore.sendAsset)
      
      const fromTok = getAssetTokFromPool({pool: toJS(selectedPairStore.currentPool), assetId: selectedPairStore.receiveAsset})
      const toTok = getAssetTokFromPool({pool: toJS(selectedPairStore.currentPool), assetId: selectedPairStore.sendAsset})
      
      console.log("fromTok",fromTok,"toTok",toTok);
      //const ratio = Decimal.from(fromTok).div(Decimal.from(toTok)).prettify(5).toString();
      setFromAsset(from);
      setToAsset(to);

      setFromTok(Decimal.from(fromTok));
      setToTok(Decimal.from(toTok));
    });

    return () => {
      detach();
    }
  }, [])

  useEffect(() => {
    const poolCtl = selectedPairStore.currentPool?.ctl ?? 0;
    const calculatedShare = new Percent(currentEstimationShare.div(poolCtl).infinite ? Decimal.ZERO : currentEstimationShare.div(poolCtl).div(100) );

    setCalculatedShare(calculatedShare);
  }, [currentEstimationShare])

  const onExpandClicked = () => {
    setIsExpanded(!isExpanded);
  }

  const isLoaded = fromAsset && toAsset;

  return (
    <Container>
    <div className='manual-expand' onClick={onExpandClicked}>
      <Label style={{marginBottom: 0}}>price and pool share</Label>
    </div>
    <ExpandedContent>
      <Flex sx={{ justifyContent: 'center', flexDirection: 'column' }}>
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          <Statistic
              name={isLoaded && `${toAsset.title} per ${fromAsset.title}`}
               >
            {toTok.div(fromTok).prettify(2)}
            </Statistic>
        </Flex>
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
        <Statistic
              name={isLoaded && `${fromAsset.title} per ${toAsset.title}`}
            >
              {fromTok.div(toTok).prettify(2)}
            </Statistic>
        </Flex>
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          <Statistic
            name='Share of pool'
            >
            {!!calculatedShare && calculatedShare.toString(2)}
            </Statistic>
        </Flex>
       </Flex>
    </ExpandedContent>
  </Container>
  )
});

export default PriceAndShare;