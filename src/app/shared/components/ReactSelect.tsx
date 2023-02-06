import React from 'react';
import Select, { components, Props } from 'react-select';
import { IOptions } from '@core/types';
import AssetIcon from '@app/shared/components/AssetsIcon';
import { CancelIcon, IconDropdownDown } from '@app/shared/icons';
import { styled } from '@linaria/react';

const AssetsId = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
display: flex;
margin-left: 4px;
color: rgba(255,255,255, 0.7);
text-transform: lowercase;
`;
interface IReactSelectProps extends Props {
  options: IOptions[];
  onChange: (any) => void;
  isFilter?: boolean;
  isIcon?: boolean
  customPrefix?: string,
  ref?
}

const ReactSelect = ({
  options, onChange, isFilter, isIcon, ref, customPrefix = 'custom-select', ...rest
}: IReactSelectProps) => {
  const {
    Option, DropdownIndicator, ClearIndicator, SingleValue,
  } = components;
  function IconOption(props) {
    const { value, label } = props;
    return (
      // TODO: ADD TYPE
      // @ts-ignore
      <Option {...props}>
        <>
          {isIcon
            ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AssetIcon asset_id={value} />
                <span>{label}</span>
                <AssetsId style={{}}>{`(id:${value})`}</AssetsId>
              </div>
            ) : <span>{label}</span> }
        </>
      </Option>
    );
  }
  function SingleValues(props) {
    const { value, data } = props;
    return (
      // TODO: ADD TYPE
      // @ts-ignore
      <SingleValue {...props}>
        <>
          {isIcon
            ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AssetIcon asset_id={data.value} />
                <span>{data.label}</span>
                <AssetsId style={{}}>{`(id:${data.value})`}</AssetsId>
              </div>
            ) : <span>{data.label}</span>}
        </>
      </SingleValue>
    );
  }
  function IndicatorSVG(props) {
    const { hasValue } = props;
    return (
      <>
        {!hasValue ? (
          <DropdownIndicator {...props}>
            <IconDropdownDown />
          </DropdownIndicator>
        ) : null}
      </>
    );
  }
  function IndicatorClear(props) {
    return (
      <ClearIndicator {...props}>
        <CancelIcon />
      </ClearIndicator>
    );
  }

  // TODO: Memo indicator ANIMATE

  return (
    <Select
      classNamePrefix={customPrefix}
      options={options}
      isClearable
      isSearchable
      ref={ref}
      onChange={onChange}
      components={{
        Option: IconOption,
        DropdownIndicator: IndicatorSVG,
        ClearIndicator: IndicatorClear,
        IndicatorSeparator: () => null,
        SingleValue: SingleValues,
      }}
      {...rest}
    />
  );
};

export default ReactSelect;
