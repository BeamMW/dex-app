import React, { useCallback, useRef } from 'react';
import { styled } from '@linaria/react';
import Utils from '@core/utils.js';
import { useNavigate } from 'react-router-dom';
import Title from '@app/shared/components/Title';
import { BackButton, Button } from '@app/shared/components/index';
import { ROUTES, ROUTES_PATH } from '@app/shared/constants';
import { IconPlus } from '@app/shared/icons';

interface WindowProps {
  onPrevious?: React.MouseEventHandler | undefined;
  title?: string;
  backButton?: boolean;
  createPool?: boolean;
}

const Container = styled.div<{ bgColor: string }>`
  background-color: ${({ bgColor }) => (Utils.isWeb() ? bgColor : 'transparent')};
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`;

const HeaderWrapper = styled.div``;
const ButtonWrapper = styled.div<{ margin: string }>`
   {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    min-width: 914px;
    max-width: 1310px;
    margin-top: ${() => (Utils.isWeb() ? '20px' : '0')} ;
  }
`;
const ButtonStyled = styled.div`
   {
    max-width: 166px;
    width: 100%;
    margin-bottom: 16px;
  }
`;

const Window: React.FC<WindowProps> = ({
  children, title, backButton, createPool,
}) => {
  const rootRef = useRef();
  const navigate = useNavigate();
  const onPreviousClick = () => {
    navigate(ROUTES.POOLS.BASE);
  };
  const createPoolNavigation = useCallback(() => {
    navigate(ROUTES_PATH.POOLS.CREATE_POOL);
  }, [navigate]);
  return (
    <>
      <Container bgColor={Utils.getStyles().background_main} ref={rootRef}>
        {createPool && (
          <ButtonWrapper>
            <ButtonStyled>
              <Button onClick={createPoolNavigation} variant="ghost" icon={IconPlus}>
                Create Pool
              </Button>
            </ButtonStyled>
          </ButtonWrapper>
        )}
        <HeaderWrapper>
          {backButton && <BackButton title="back" onClick={onPreviousClick} />}
          {title && <Title variant="heading">{title}</Title>}
        </HeaderWrapper>
        {children}
      </Container>
    </>
  );
};

export default Window;
