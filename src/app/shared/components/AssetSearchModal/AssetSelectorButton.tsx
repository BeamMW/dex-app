import React, { useState } from 'react';
import { styled } from '@linaria/react';
import { IOptions } from '@core/types';
import { rowCenter, warningBadgeBase } from '../../../styles/linariaShared';
import AssetIcon from '@app/shared/components/AssetsIcon';
import { IconDropdownDown } from '@app/shared/icons';
import AssetSearchModal from './AssetSearchModal';

interface AssetSelectorButtonProps {
  value: IOptions | null;
  onSelect: (option: IOptions) => boolean | void;
  placeholder?: string;
  excludeAssetId?: number | null;
  mode?: 'asset-only' | 'explore';
  // controlled open state — when provided, external code manages open/close
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onPairSelect?: (aid1: number, aid2: number, label: string) => void;
  showWarning?: boolean;
}

const SelectorBtn = styled('button')`
  ${rowCenter}
  gap: 8px;
  width: 100%;
  height: 41px;
  padding: 0 12px 0 14px;
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
`;

const Label = styled.span`
  flex: 1;
  min-width: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
`;

const AssetSelectorButton: React.FC<AssetSelectorButtonProps> = ({
  value,
  onSelect,
  placeholder = 'Select asset',
  excludeAssetId = null,
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
            {value.value !== -1 && <AssetIcon asset_id={value.value} />}
            <Label>{value.label}</Label>
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
        mode={mode}
        onPairSelect={onPairSelect}
      />
    </>
  );
};

export default AssetSelectorButton;
