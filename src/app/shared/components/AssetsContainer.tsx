import React from "react";
import { styled } from "@linaria/react";
interface SectionProps {
  variant?: 'column'

}
const SectionStyled = styled.div<SectionProps>`
  display: flex;
  justify-content: space-between;
  max-width: 954px;
  width: 100%;
`
const AssetsContainer: React.FC<SectionProps> = ({
  children
}) => {
  return (
    <SectionStyled>
      {children}
    </SectionStyled>
  );
};

export default AssetsContainer;
