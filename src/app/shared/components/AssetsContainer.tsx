import React from "react";
import { styled } from "@linaria/react";
interface SectionProps {
  variant?: 'center' | 'space-between'

}
const SectionStyled = styled.div<SectionProps>`
  display: flex;
  justify-content: ${({variant}) => variant};
  max-width: 954px;
  width: 100%;
`

const AssetsContainer: React.FC<SectionProps> = ({
  children,
  variant= 'space-between'
}) => {
  return (
    <SectionStyled variant={variant}>
      {children}
    </SectionStyled>
  );
};

export default AssetsContainer;
