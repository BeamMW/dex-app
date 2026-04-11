import React, { useState } from 'react';
import { styled } from '@linaria/react';
import { IOptions } from '@core/types';
import AssetIcon from '@app/shared/components/AssetsIcon';
import { IconDropdownDown } from '@app/shared/icons';
import { rowCenter, warningBadgeBase } from '../../../styles/linariaShared';
import AssetSearchModal from './AssetSearchModal';

interface AssetSelectorButtonProps {
  value: IOptions | null;
  onSelect: (option: IOptions) => boolean | void;
  placeholder?: string;
  excludeAssetId?: number | null;
  allowedAssetIds?: ReadonlySet<number> | null;
  mode?: 'asset-only' | 'explore';
  // controlled open state — when provided, external code manages open/close
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onPairSelect?: (aid1: number, aid2: number, label: string) => void;
  showWarning?: boolean;
}

const SelectorBtn = styled('button')`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 41px;
  height: auto;
  padding: 6px 12px 6px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 170px;
  cursor: pointer;
  color: white;
  font-size: 14px;
  font-family: 'ProximaNova', 'SFProDisplay', sans-serif;
  overflow: hidden;
  min-width: 0;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &:focus-visible {
    outline: 1px solid var(--color-green);
  }

  @media (max-width: 480px) {
    gap: 4px;
    padding: 6px 8px 6px 10px;
    font-size: 13px;
  }
`;

/** Tighter than default AssetIcon margin so label + id fit in narrow pickers */
const SelectorAssetIcon = styled(AssetIcon)`
  && {
    margin-right: 6px;
  }

  @media (max-width: 480px) {
    && {
      margin-right: 3px;
    }
  }
`;

/** Name + compact id share a row that may wrap so the full ticker can show */
const ValueRow = styled.span`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 6px;
  row-gap: 2px;
  text-align: left;
`;

const Label = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const Placeholder = styled(Label)`
  color: rgba(255, 255, 255, 0.5);
`;

const ChevronWrap = styled('span')`
  ${rowCenter}
  flex-shrink: 0;
  opacity: 0.5;
`;

const WarningBadge = styled('span')`
  ${warningBadgeBase}
  padding: 1px 6px;
  margin-right: 10px;

  @media (max-width: 480px) {
    margin-right: 4px;
  }
`;

const AssetIdLabel = styled('span')`
  font-size: 10px;
  line-height: 1.2;
  font-weight: 500;
  opacity: 0.45;
  flex-shrink: 0;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const AssetSelectorButton: React.FC<AssetSelectorButtonProps> = ({
  value,
  onSelect,
  placeholder = 'Select asset',
  excludeAssetId = null,
  allowedAssetIds = null,
  mode = 'asset-only',
  isOpen: controlledIsOpen,
  onOpen,
  onClose: controlledOnClose,
  onPairSelect,
  showWarning = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalOpen;

  const handleOpen = () => {
    if (isControlled) {
      onOpen?.();
    } else {
      setInternalOpen(true);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      controlledOnClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  return (
    <>
      <SelectorBtn type="button" onClick={handleOpen}>
        {value ? (
          <>
            {value.value !== -1 && <SelectorAssetIcon asset_id={value.value} />}
            <ValueRow>
              <Label>{value.label}</Label>
              {value && value.value !== -1 && (
                <AssetIdLabel title={`Asset id ${value.value}`}>{`(${value.value})`}</AssetIdLabel>
              )}
            </ValueRow>
            {showWarning && <WarningBadge>fake</WarningBadge>}
          </>
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
        <ChevronWrap>
          <IconDropdownDown />
        </ChevronWrap>
      </SelectorBtn>

      <AssetSearchModal
        isOpen={open}
        onClose={handleClose}
        onSelect={onSelect}
        excludeAssetId={excludeAssetId}
        allowedAssetIds={allowedAssetIds}
        mode={mode}
        onPairSelect={onPairSelect}
      />
    </>
  );
};

export default AssetSelectorButton;
