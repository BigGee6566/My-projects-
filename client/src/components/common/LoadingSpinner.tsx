import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color,
  className
}) => {
  return (
    <SpinnerContainer className={className}>
      <Spinner size={size} color={color} />
    </SpinnerContainer>
  );
};

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div<{
  size: string;
  color?: string;
}>`
  border: 2px solid ${({ theme, color }) => color || theme.colors.neutral.light};
  border-top: 2px solid ${({ theme, color }) => color || theme.colors.primary.main};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${({ size }) => {
    switch (size) {
      case 'sm':
        return `width: 16px; height: 16px;`;
      case 'md':
        return `width: 24px; height: 24px;`;
      case 'lg':
        return `width: 32px; height: 32px;`;
      default:
        return `width: 24px; height: 24px;`;
    }
  }}
`;

export default LoadingSpinner;