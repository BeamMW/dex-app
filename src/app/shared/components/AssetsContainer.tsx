import React from 'react';
import { styled } from '@linaria/react';

interface SectionProps {
  variant?: 'center' | 'space-between'

}
const SectionStyled = styled.div<SectionProps>`
  display: flex;
  justify-content: ${({ variant }) => variant};
  max-width: 954px;
  width: 100%;
  justify-content: space-between;
  position: relative;
`;
const AssetsContainer: React.FC<SectionProps> = ({
  children,
  variant = 'space-between',
}) => (
  <SectionStyled variant={variant}>
    {children}
  </SectionStyled>
);

export default AssetsContainer;
