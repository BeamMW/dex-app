import React from 'react';
import { styled } from '@linaria/react';
import { Window } from '@app/shared/components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
  color: white;
`;

const MainPage: React.FC = () => {
  return (
    <>
      <Window>
        <Container>
          BEAM DAPP REACT
        </Container>
      </Window>
    </>
  );
};

export default MainPage;
