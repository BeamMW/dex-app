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
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: auto;
  align-items: center;
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
  width: 100%;
  max-width: 412px;
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
  min-width: 0;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: minmax(0, 620px) minmax(0, 1fr);
  grid-gap: 20px;
  align-items: flex-start;
  margin-top: 10px;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

/** Left column (swap form); on narrow screens first: trade, then summary, then pool. */
export const EmbeddedSwapColumn = styled.div`
  min-width: 0;
  @media (max-width: 1080px) {
    order: 1;
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

  & > *:first-child {
    flex: 1;
    min-width: 0;
  }
`;

export const InlineSelect = styled.div`
  width: 220px;
  max-width: 52%;
  min-width: 200px;
  min-height: 41px;
  flex-shrink: 0;
`;

export const SearchHint = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 6px;
`;

export const HintRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
`;

export const ErrorHint = styled.span`
  color: #ff625c;
  font-size: 11px;
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

/** Right column stack: pool info card, then trade summary below (spacing via margin, not gap). */
export const EmbeddedRightStack = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  @media (max-width: 1080px) {
    display: contents;
  }
`;

/** Separates trade summary from the pool card; margin works more reliably than flex gap here. */
export const EmbeddedTradeSummaryBelowPool = styled.div`
  margin-top: 16px;
  width: 100%;
  @media (max-width: 1080px) {
    margin-top: 0;
    order: 2;
  }
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
  justify-content: flex-start;
  @media (max-width: 1080px) {
    order: 3;
  }
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
  border-radius: 18px;
  padding: 12px;
  margin-top: 0;
  background: rgba(255, 255, 255, 0.02);
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
