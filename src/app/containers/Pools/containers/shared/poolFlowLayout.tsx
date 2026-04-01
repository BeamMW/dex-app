import { styled } from '@linaria/react';

/** Absolute-position flip control for legacy standalone trade layout */
export const ExchangeWrapper = styled.div`
  position: absolute;
  top: 71px;
  left: 435px;
  @media (max-width: 913px) {
    top: 135px;
    left: 44%;
  }
`;

export const SectionWrapper = styled.div`
  margin: 10px 0 40px 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: auto;
  @media (max-width: 913px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 48px;
`;

export const SummaryTitle = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.5);
  max-width: 62px;
  width: 100%;
  margin-right: 30px;
`;

export const TotalTitle = styled(SummaryTitle)`
  font-weight: 700;
  line-height: 17px;
  color: var(--color-white);
`;

export const SummaryContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 14px;
  align-items: center;
`;

export const SummaryAsset = styled.div`
  display: flex;
`;

export const AssetAmount = styled.div`
  justify-content: flex-start;
  display: flex;
`;

export const Line = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  width: 412px;
  margin: 20px 0;
`;

export const ButtonBlock = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  max-width: 363px;
  width: 100%;
  justify-content: space-between;
`;

export const SelectWrapper = styled.div`
  width: 100%;
  max-width: 914px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-gap: 12px;
  margin: 18px 0;
  @media (max-width: 913px) {
    grid-template-columns: 1fr;
  }
`;

export const EmbeddedLayout = styled.div`
  width: 100%;
  max-width: 1230px;
  display: grid;
  grid-template-columns: minmax(0, 540px) minmax(0, 1fr);
  grid-gap: 20px;
  align-items: flex-start;
  margin-top: 10px;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const SwapCard = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.02);
  padding: 16px;
`;

export const SwapBlock = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 10px;
`;

export const InputRow = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  align-items: center;
  min-width: 0;
`;

export const InlineSelect = styled.div`
  width: 170px;
  max-width: 45%;
  min-width: 140px;
  min-height: 41px;
  flex-shrink: 0;
`;

export const SearchHint = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 6px;
`;

export const BlockLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
`;

export const EmbeddedExchangeWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 4px 0 10px;
`;

export const EmbeddedTradeButtonWrap = styled.div`
  width: 100%;
  margin-top: 12px;
`;

export const RightPanel = styled.div`
  width: 100%;
  min-height: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.02);
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const EmptyPoolState = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  padding: 24px 0;
  text-align: center;
`;

export const EmbeddedActionRow = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  margin-top: 14px;
`;

export const RateRow = styled(SummaryContainer)`
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 10px;
`;

export const RateText = styled.div`
  color: var(--color-white);
  font-size: 14px;
  line-height: 14px;
`;

export const SummaryPanel = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  margin-top: 12px;
`;

export const SummaryHeader = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--color-white);
  margin-bottom: 14px;
`;
