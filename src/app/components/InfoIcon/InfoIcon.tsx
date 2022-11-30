import React from "react";
import Tippy, { TippyProps } from "@tippyjs/react";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Flex } from "theme-ui";
import { InfoIconSvg } from "@app/assets/icons";

export type InfoIconProps = Pick<TippyProps, "placement"> &
  Pick<FontAwesomeIconProps, "size"> & {
    tooltip: React.ReactNode;
    width?: string;
  };

export const InfoIcon: React.FC<InfoIconProps> = ({ placement = "top", tooltip }) => {
  return (
    <Tippy interactive={true} placement={placement} content={tooltip} maxWidth="260px">
      <Flex sx={{alignItems:"center", opacity:0.3}}>
        &nbsp;
        <InfoIconSvg width={'12px'} height={'12px'}/>
      </Flex>
    </Tippy>
  );
};
