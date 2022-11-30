import React from 'react';
import { Box, Text } from 'theme-ui';
import { styled } from '@linaria/react';
import { css } from '@linaria/core';
import { CustomSelect } from '@app/components/SelectWithInput/Select.style';

interface InputWithIconProps {
  showAutoButton: boolean;
  icon: string;
}

const Input = styled.input`
  font-family: 'ProximaNova';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: white;
  background-color: rgba(255, 255, 255, 0);
  padding: 15px 20px;
  width: 90%;
  border-radius: 10px;
  border: none;
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    width: 100%;
    user-select: none;
    font-size: 14px;
    font-weight: normal;
    padding: 0;

    &.open {
      border: none;
      border-radius: 10px;
    }

    &.focus {
      background-color: rgba(255, 255, 255, 0.12);
    }
`

const InputContainer = styled.div`
  width: 100%;
  max-width: 450px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
`

export const InputWithIcon: React.FC<InputWithIconProps> = ({ showAutoButton, icon }) => {

  return (
    <InputContainer>
      <CustomSelect>
      <Container>
        <Input />
        <Box sx={{ 
          p:'20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Text sx={{ mr: '10px' }}>{icon}</Text>
          {
            showAutoButton && (

          <Box sx={{
            width: '100px',
            textAlign: 'center',
            background: 'rgba(0, 246, 210, 0.1)',
            border: '1px solid #00F6D2',
            borderRadius: '8px',
            ml:'10px'
          }}>
            <Text sx={{
              fontFamily: 'ProximaNova',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '14px',
              textAlign: 'center',
              color: '#00F6D2', 
              padding: '4px 0',
              display: 'block',       
            }}>
              auto
            </Text>
          </Box>
        )}
        </Box>
      </Container>
      </CustomSelect>

  </InputContainer>
  )
}