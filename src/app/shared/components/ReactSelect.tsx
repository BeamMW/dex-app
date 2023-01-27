import React from "react";
import Select from "react-select";
import { IOptions } from "@core/types";

interface IReactSelectProps {
  options: IOptions[],
  onChange: (any)=>void,
  isFilter: boolean,
}

const ReactSelect = ({options, onChange, isFilter, ...rest}:IReactSelectProps) => {
  return (
    <Select  classNamePrefix="custom-filter"
             options={options}
             {...rest}
             isMulti
             placeholder='Filter by'
             onChange={onChange}
    />
  );
};

export default ReactSelect;
