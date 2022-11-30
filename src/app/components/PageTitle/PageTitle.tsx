import React, { FC } from 'react';
import { BackButton } from '../BackButton/BackButton';
import { TitleContainer, Title, TitleChildren } from './PageTitle.style';

export interface PageTitleProps {
  title: string;
  children?: React.ReactNode;
  backButton?: boolean;
}

export const PageTitle:FC<PageTitleProps> = ({ title, backButton = true, children }) => {

  return (
  <TitleContainer>
  { backButton && <BackButton text="back"/> }  
    <Title>{ title }</Title>
    <TitleChildren>
      { children }
    </TitleChildren>
  </TitleContainer>
  )
}