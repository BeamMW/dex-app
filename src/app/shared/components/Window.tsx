import React, { useCallback, useRef } from 'react';
import { styled } from '@linaria/react';
import Utils from '@core/utils.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { css } from '@linaria/core';
import Title from '@app/shared/components/Title';
import { BackButton, Button } from '@app/shared/components/index';
import { ROUTES, ROUTES_PATH } from '@app/shared/constants';
import { IconPlus } from '@app/shared/icons';

interface WindowProps {
  onPrevious?: React.MouseEventHandler | undefined;
  title?: string,
  backButton?: boolean
  createPool?: boolean
}

const Container = styled.div<{ bgColor: string }>`
  background-color: ${({ bgColor }) => (Utils.isWeb() ? bgColor : 'transparent')};
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
display: flex;
width: 100%;
justify-content: center;
`;

const StyledTitle = styled.div`
  font-weight: 500;
  font-size: 36px;
  margin-bottom: 20px;

  > .controls {
    height: 36px;
    position: absolute !important;
    right: 40px !important;
    top: 37px !important;
    display: flex;
    align-items: flex-end;

    > .new-button-class {
      max-width: 230px !important;
      margin-bottom: 0 !important;
      margin-right: 30px !important;
    }
  }
`;

const TitleValue = styled.span`
  cursor: pointer;
`;

const BackStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 5px;
  font-weight: bold;
  font-size: 14px;

  > .control {
    cursor: pointer;
  }

  > .control .control-text {
    margin-left: 15px;
  }
`;

const PkeyButtonClass = css`
  margin: 0 !important;
  min-width: 150px;
  text-align: end;
  font-weight: 400 !important;
  display: flex;
  font-size: 16px !important;
`;

const NewButtonClass = css`
  margin-bottom: 0 !important;
  margin-right: 30px !important;
`;
const ButtonWrapper = styled.div`
{
  width: 100%;
  display:flex;
  justify-content: flex-end;
}`;
const ButtonStyled = styled.div`{
  max-width: 166px;
  width: 100%;
 margin-bottom: 16px;
}`;

const Window: React.FC<WindowProps> = ({
  children, onPrevious,
  title,
  backButton,
  createPool,
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
            <Button onClick={createPoolNavigation} variant="ghost" icon={IconPlus}>Create Pool</Button>
          </ButtonStyled>
        </ButtonWrapper>
        )}
        <HeaderWrapper>
          {backButton && (
          <BackButton
            title="back"
            onClick={onPreviousClick}
          />
          )}
          {title && <Title variant="heading">{title}</Title>}
        </HeaderWrapper>
        {children}
      </Container>
    </>
  );
};

export default Window;
