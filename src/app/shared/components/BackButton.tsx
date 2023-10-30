import React from 'react';
import { css, cx } from '@linaria/core';

import { AngleBackIcon, ArrowLeftIcon } from '@app/shared/icons';

import Button from './Button';

interface BackButtonProps {
  className?: string;
  onClick: React.MouseEventHandler;
  title: string
}

const backStyle = css`
  position: fixed;
  z-index: 3;
  left: 15px;
`;
const title = css`
  color:white;
  margin-left: 10px;
`;

const BackButton: React.FC<BackButtonProps> = ({ className, onClick, title }) => (
  <Button
    variant="control"
    icon={ArrowLeftIcon}
    pallete="white"
    className={cx(backStyle, className)}
    onClick={onClick}
  >
    {title}
  </Button>
);

export default BackButton;
