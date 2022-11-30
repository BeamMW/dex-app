import useGetAvailableAssetsList from "@app/hooks/useGetAvailableAssetsList";
import useProcessAssetsForSelect from "@app/hooks/useProcessAssetsForSelect";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactSelect from "react-select";
import { Box } from "theme-ui";


const customStyles = {
    container: (provided, state) => {
  
      return {
        ...provided,
        display: "inline-block",
        position: "relative",
        padding: 0,
        width: "20rem",
      }
      
    },
    input: (provided, state) => {
      return {
        ...provided,
        padding: "2px 1rem",
        caretColor: "#fff",
        color: "#fff"
      }
    },
    control: (provided, state) => {
      const {isDisabled, isFocused} = state;
      
      return {
        ...provided,
        display: "flex",
        borderRadius: "10px",
        justifyContent: "center",
        alignItems: "center",
        lineHeight: "18px",
        cursor: (isDisabled && !isFocused ? 'default' : 'pointer'),
        background:"#0a1623",
        textDecoration: "none",
        color: "#fff",
        whiteSpace: "nowrap",
        border: "none",
        boxShadow: "none",
        "&:hover,&:active": {
          opacity: 0.8
        }
      }
    },
    indicatorSeparator: (provided, state) => {
      return false;
    },
    dropdownIndicator: (provided, state) => {
      return { 
        display: "none",
      };
    },
    indicatorsContainer: (provided, state) => {
      return false;
    },
    singleValue: (provided, state) => {
      return { 
        ...provided, 
        color: "#fff", 
        fontSize: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flexEnd",
      
      };
    },
    multiValue: (provided, state) => {
      return { 
        ...provided, 
        color: "#fff", 
        fontSize: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flexEnd",
        background: "#051f35",
        "&:hover,&:active": {
          background: "inherit",
          color: "inherit",
          opacity: 0.8
        }
      };
    },
    valueContainer: (provided, state) => {
      return { 
        ...provided, 
        color: "#fff", 
        display: "flex",
        padding: "0 0.65rem",
        /* flexDirection: "row-reverse", */
      };
    },
    menu: (provided, state) => {
  
      return {
        ...provided,
        position: "absolute",
        top: "100%",
        right: "0",
        zIndex: "1",
        marginTop: "0.2rem",
        padding: "10px 0",
        borderRadius: "2px",
        backgroundColor: "#00446F",
        width: "-webkit-fill-available",
        minWidth: "9rem"
      }
    },
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        cursor: "pointer",
        textAlign: "left",
        whiteSpace: "nowrap",
        backgroundColor: (isFocused ? "rgba(255, 255, 255, 0.07)" : "transparent"),
        
      };
    },
  }

const FilterSearch: React.FC<{
    handler: any
}> = (props) => {
    const {handler} = props;
    const [selected, setSelected] = useState(null);
    const [assets, setAssets] = useState<any>([]);

    const handleInputChange = (newValue) => {
      return newValue;
    };
    
    const preparedSelectAssets = useProcessAssetsForSelect(
      useGetAvailableAssetsList()
    );

    const filterOption = useCallback(() => true, []);

    try {
      return <ReactSelect
      isMulti
      /* isDisabled={readOnlySelect} */
      classNamePrefix={'Select'}
      placeholder="Select Assets"
      styles={customStyles}
      isSearchable={false}
      /* components={{DropdownIndicator}} */
      value={selected || null}
      options={preparedSelectAssets}
      onChange={option => {
        console.log("option",option);
          setSelected(option);
          handler(option)
      }}
      filterOption={filterOption}
      isClearable={true}
      onInputChange={handleInputChange}
    />;
    } catch(e) {
      console.log(e);
      return <></>
    }

    
}

export default FilterSearch;