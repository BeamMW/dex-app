import React from "react";
import { styled } from "@linaria/react";

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
  width: 100%;
  min-height: 600px;
  height: 100%;
  justify-content: space-between;
`;

const Container: React.FC = ({
  children
  }) => {
  return (
    <ContainerStyled>
      {children}
    </ContainerStyled>
  );
};

export default Container;
