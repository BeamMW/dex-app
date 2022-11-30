import React, { useCallback, useEffect, useState } from "react";
import { Box, Text } from "theme-ui";
import styled from "styled-components";
import {
  BeamIcon,
  BeamxIcon,
  EthIcon,
  NephriteIcon,
  SeperatorIcon,
} from "@app/assets/icons";
import { css } from "@linaria/core";
import ReactSelect, { components } from "react-select";
import { Label, CustomSelect } from "./Select.style";
import Angle from "../Select/Angle";
import { Decimal } from "@app/library/base/Decimal";
import { isAmountValid } from "@app/utils/amountHandler";
import _ from "lodash";
import { useAsync } from "react-async";
//import Equalizer from '../Equalized';

interface SelectWithInputProps {
  label?: string;
  showConvertedToUsd?: boolean;
  maxAmount?: boolean;
  color: string;
}

interface InputProps {
  color: string;
}

const Input = styled.input<InputProps>`
  font-family: 'ProximaNova';
  font-style: normal;
  font-weight: 400;
  font-size: 36px;
  line-height: 36px;
  color: ${({ color }) => `var(--color-${color})`};
  background-color: rgba(255, 255, 255, 0);
  padding: ${({ readOnly }) => (readOnly ? "15px 0px" : "15px 20px")};
  width: 90%;
  border-radius: 10px;
  border: none;
  cursor: auto;
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    width: 100%;
    user-select: none;
    font-size: 14px;
    font-weight: normal;
    padding: 0;

    &.open {
      border: none;
      border-radius: 10px;
    }

    &.focus {
      background-color: rgba(255, 255, 255, 0.12);
    }
`;

const selectClassName = css`
`;

const LabelStyled = styled.div`
  font-family: 'ProximaNova';
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #FFFFFF;
  margin-left: 8px;
  vertical-align: super;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 450px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  padding: 20px;
`;

const DropdownIndicator = (props) => {
  const { isDisabled, isFocused } = props;

  return (
    <components.DropdownIndicator {...props}>
      <Angle
        value={isDisabled || !isFocused ? 0 : 180}
        margin={!isDisabled && isFocused ? 3 : 1}
      />
    </components.DropdownIndicator>
  );
};

const customStyles = {
  container: (provided, state) => {
    return {
      ...provided,
      display: "inline-block",
      position: "relative",
      marginLeft: "10px",
      padding: 0,
    };
  },
  control: (provided, state) => {
    const { isDisabled, isFocused } = state;

    return {
      ...provided,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      lineHeight: "18px",
      cursor: isDisabled && !isFocused ? "default" : "pointer",
      backgroundColor: "transparent",
      textDecoration: "none",
      color: "#fff",
      whiteSpace: "nowrap",
      margin: "auto 5px",
      border: "none",
      boxShadow: "none",
      width: "max-content",
      "&:hover,&:active": {
        backgroundColor: "transparent",
      },
    };
  },
  menu: (provided, state) => {
    return {
      ...provided,
      position: "absolute",
      top: "100%",
      right: "0",
      zIndex: "1",
      marginTop: "1rem",
      padding: "10px 0",
      borderRadius: "10px",
      backgroundColor: "#00446F",
      width: "auto",
      minWidth: "9rem",
    };
  },
  indicatorSeparator: (provided, state) => {
    return false;
  },
  indicatorsContainer: (provided, state) => {
    return {
      ...provided,
    };
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      cursor: "pointer",
      textAlign: "left",
      whiteSpace: "nowrap",
      backgroundColor: isFocused ? "rgba(255, 255, 255, 0.07)" : "transparent",
      "&:hover, &:active": {
        backgroundColor: "transparent",
      },
    };
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
  valueContainer: (provided, state) => {
    return {
      ...provided,
      color: "#fff",
      padding: 0,
      display: "flex",
    };
  },
};

export const SelectWithInput: React.FC<any> = ({
  optionsList,
  onChange,
  onInputChange,
  label,
  inputColor,
  showConvertedToUsd = true,
  maxAmount = false,
  readOnlySelect = false,
  editedAmount,
  setEditedAmount,
  inputEditableStyle,
  readOnlyInput = false,
  isInputVisible = true,
}) => {
  const [value, setValue] = React.useState();
  const [invalid, setInvalid] = useState(false);

  const [storeOptions, setStoreOptions] = useState(optionsList);
  const [selected, setSelected] = useState(optionsList[0]);

  useEffect(() => {
    if (
      !_.isEqual(
        _.map(storeOptions, (i) => i.value),
        _.map(optionsList, (i) => i.value)
      )
    ) {
      setStoreOptions(optionsList);
      setSelected(optionsList[0]);
    }
  }),
    [optionsList];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value }: { value: string } = e.target;

    if (
      !!isAmountValid(value) &&
      ((+maxAmount && +value <= +maxAmount) || !+maxAmount)
    ) {
      setInvalid(false);
      setEditedAmount(value);
    } else {
      e.target.value = editedAmount;
      setInvalid(true);
    }
  };

  const filterOption = useCallback(() => true, []);

  /* const options = useAsync({
      promiseFn: useCallback(() => optionsList, [optionsList])
  }); */

  return (
    <InputContainer>
      <Box sx={{ marginBottom: "10px" }}>
        <Label>{label}</Label>
      </Box>
      <CustomSelect readOnly={readOnlyInput}>
        <Container>
          {isInputVisible &&
            (readOnlyInput ? (
              <Input
                color={inputColor}
                readOnly={true}
                value={
                  !+editedAmount
                    ? Decimal.ZERO.prettify(2)
                    : editedAmount.prettify(2)
                }
                sx={{
                  ...inputEditableStyle,
                  fontWeight: "light",
                  background: invalid
                    ? "linear-gradient(0deg, rgba(198, 62, 62, 0.1), rgba(198, 62, 62, 0.1)), #fff"
                    : "#fff",
                  border: invalid
                    ? "1px solid #C63E3E"
                    : "1px solid transparent",
                }}
              />
            ) : (
              <Input
                color={inputColor}
                readOnly={readOnlyInput}
                onChange={handleChange}
                value={!+editedAmount ? "" : editedAmount}
                /* defaultValue={!+editedAmount ? 
                  '' : 
                  editedAmount.prettify(2)} */
                sx={{
                  ...inputEditableStyle,
                  fontWeight: "light",
                  background: invalid
                    ? "linear-gradient(0deg, rgba(198, 62, 62, 0.1), rgba(198, 62, 62, 0.1)), #fff"
                    : "#fff",
                  border: invalid
                    ? "1px solid #C63E3E"
                    : "1px solid transparent",
                }}
              />
            ))

            /* maxAmount && (
                <>
                <Box sx={{
                  width: '100px',
                  textAlign: 'center',
                  background: 'rgba(0, 246, 210, 0.1)',
                  border: '1px solid #00F6D2',
                  borderRadius: '8px',
                  ml: '10px',
                  cursor: 'pointer'
                }}>
                  <Text sx={{
                    fontFamily: 'ProximaNova',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '14px',
                    textAlign: 'center',
                    color: '#00F6D2',
                    padding: '4px 0',
                    display: 'block',
                  }}>
                    auto
                  </Text>
                </Box>
                <Box sx={{ ml: '15px' }}>
                  <SeperatorIcon />
                </Box>
                </>
              ) */
          }

          <ReactSelect
            isDisabled={readOnlySelect}
            classNamePrefix={"Select"}
            styles={customStyles}
            isSearchable={false}
            components={{ DropdownIndicator }}
            value={selected}
            options={storeOptions}
            onChange={(option) => {
              setSelected(option);
              return onChange(option.value);
            }}
            //value={_.find(optionsList, (option) => option.value === )}
            cacheOptions={false}
            filterOption={filterOption}
          />
        </Container>
      </CustomSelect>
      {/* {
       showConvertedToUsd && <Equalizer styles={{padding: readOnlyInput ? '6px 0px' : '6px 20px'}} assetId={selected.value} assetAmount={editedAmount} />
      } */}
    </InputContainer>
  );
};
