import React from "react";
import { styled } from "@linaria/react";
import { ExpendIcon } from "@app/assets/icons";
import { Label } from "@app/components/SelectWithInput/Select.style";
import { Statistic } from "@app/components/Statistic/Statistic";
import { Flex } from "theme-ui";
import { InputWithIcon } from "@app/InputWithIcon/InputWithIcon";

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

const CurrentLiquidity = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);


const onExpandClicked = () => {
  setIsExpanded(!isExpanded);
}
  return (
    <Container>
      <div className='manual-expand' onClick={onExpandClicked}>
      <Label style={{marginBottom: 0}}>BEAM / ETH</Label>
      <ExpendIcon className={'icon-expand ' + (isExpanded ? 'expanded' : '')}/>
    </div>
    { isExpanded ? 
    <ExpandedContent>
      <Flex sx={{ justifyContent: 'center', flexDirection: 'column' }}>
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          <Statistic
            name='Pooled BEAM'
            >
            100
            </Statistic>
        </Flex>
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          <Statistic
            name='Pooled ETH'
            >
              1
            </Statistic>
        </Flex>
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          <Statistic
            name='Your pool tokens'
            >
            0.00000000014
            </Statistic>
        </Flex>
        <Flex sx={{ flexDirection: 'column', width: '100%' }}>
          <Statistic
            name='Your pool share'
            >
             0.01% 
            </Statistic>
        </Flex>
       </Flex>
    </ExpandedContent> : <></>}
  </Container>
  )
}

export default CurrentLiquidity;