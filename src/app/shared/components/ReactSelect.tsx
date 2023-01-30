import React from 'react';
import Select, { components, Props } from 'react-select';
import { IOptions } from '@core/types';
import AssetIcon from '@app/shared/components/AssetsIcon';

interface IReactSelectProps extends Props {
  options: IOptions[];
  onChange: (any) => void;
  isFilter?: boolean;
  isIcon?: boolean
}

const ReactSelect = ({
  options, onChange, isFilter, isIcon, ...rest
}: IReactSelectProps) => {
  const { Option } = components;
  function IconOption(props: IOptions) {
    const { value, label } = props;
    return (
      // TODO: ADD TYPE
      // @ts-ignore
      <Option {...props}>
        <>
          {isIcon && <AssetIcon asset_id={value} />}
          <span>{label}</span>
        </>
      </Option>
    );
  }

  return (
    <Select
      classNamePrefix="custom-filter"
      options={options}
      {...rest}
      isMulti={isFilter}
      // @ts-ignore
      components={{ Option: IconOption }}
      onChange={onChange}
    />
  );
};

export default ReactSelect;
