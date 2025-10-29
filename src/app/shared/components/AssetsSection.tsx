import React from 'react';
import { styled } from '@linaria/react';

const SectionStyled = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  border: none;
  outline: none;
  border-radius: 10px;
  padding-right: 15px;
  background-color: rgba(255, 255, 255, 0.05);
`;
const AssetsSection: React.FC = ({ children }) => <SectionStyled>{children}</SectionStyled>;

export default AssetsSection;
