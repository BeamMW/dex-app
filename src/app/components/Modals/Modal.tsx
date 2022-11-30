import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Box, Button, Flex } from 'theme-ui';
import { CloseIcon, SendIcon } from '@app/assets/icons';


import {
  Wrapper,
  ModalContent,
  ModalHeader,
  SubHeader
} from './modal.style';

export interface ModalProps {
  isShown: boolean;
  children: JSX.Element;
  header?: string;
  subHeader?: string;
  width?: string;
}

export const Modal: FC<ModalProps> = ({
  isShown,
  header,
  subHeader,
  width,
  children
}) => {
  const modal = (
    <React.Fragment>
      <Wrapper>
        <ModalContent width={width}>
        <Box sx={{marginBottom: '30px'}}>
        {
          header && (
            <ModalHeader>
              { header }
            </ModalHeader>
        )}
        {
          subHeader && (
            <SubHeader>
              {subHeader}
            </SubHeader>
          )
        }
        </Box>
          { children }
          <Flex sx={{ justifyContent: 'center', mt: '50px' }}>
            <Box>
              <Button sx={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                <Box sx={{ mr: '10px', display: 'flex' }}>
                  <CloseIcon />
                </Box>
                  cancel
              </Button>
            </Box>
            <Box sx={{ ml: '10px' }}>
              <Button sx={{ background: '#DA68F5', color: '#042548' }}>
                <Box sx={{ mr: '10px', display: 'flex' }}>
                  <SendIcon />
                </Box>
                  confirm
              </Button>
            </Box>
          </Flex>
        </ModalContent>
      </Wrapper>
    </React.Fragment>
  );

  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};
