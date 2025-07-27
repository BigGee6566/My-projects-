import React from 'react';
import styled, { css } from 'styled-components';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  as?: React.ElementType;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      {...props}
    >
      {loading && <LoadingIcon size={16} />}
      {children}
    </StyledButton>
  );
};

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background: ${({ theme }) => theme.colors.primary.gradient};
        color: ${({ theme }) => theme.colors.text.inverse};
        border: 2px solid transparent;

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.primary.dark};
          transform: translateY(-1px);
          box-shadow: ${({ theme }) => theme.shadows.md};
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;

    case 'secondary':
      return css`
        background: ${({ theme }) => theme.colors.secondary.main};
        color: ${({ theme }) => theme.colors.text.inverse};
        border: 2px solid transparent;

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.secondary.dark};
          transform: translateY(-1px);
          box-shadow: ${({ theme }) => theme.shadows.md};
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;

    case 'outline':
      return css`
        background: transparent;
        color: ${({ theme }) => theme.colors.primary.main};
        border: 2px solid ${({ theme }) => theme.colors.primary.main};

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.primary.main};
          color: ${({ theme }) => theme.colors.text.inverse};
          transform: translateY(-1px);
          box-shadow: ${({ theme }) => theme.shadows.md};
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;

    case 'ghost':
      return css`
        background: transparent;
        color: ${({ theme }) => theme.colors.text.primary};
        border: 2px solid transparent;

        &:hover:not(:disabled) {
          background: ${({ theme }) => theme.colors.neutral.light};
        }

        &:active:not(:disabled) {
          background: ${({ theme }) => theme.colors.neutral.medium};
        }
      `;

    case 'danger':
      return css`
        background: ${({ theme }) => theme.colors.status.error};
        color: ${({ theme }) => theme.colors.text.inverse};
        border: 2px solid transparent;

        &:hover:not(:disabled) {
          background: #dc2626;
          transform: translateY(-1px);
          box-shadow: ${({ theme }) => theme.shadows.md};
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      `;

    default:
      return css``;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        min-height: 36px;
      `;

    case 'md':
      return css`
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
        font-size: ${({ theme }) => theme.typography.fontSize.base};
        min-height: 44px;
      `;

    case 'lg':
      return css`
        padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
        font-size: ${({ theme }) => theme.typography.fontSize.lg};
        min-height: 52px;
      `;

    default:
      return css``;
  }
};

const StyledButton = styled.button<{
  variant: string;
  size: string;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-family: ${({ theme }) => theme.typography.fontFamily.primary};
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  ${({ variant }) => getVariantStyles(variant)}
  ${({ size }) => getSizeStyles(size)}
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary.main};
    outline-offset: 2px;
  }
`;

const LoadingIcon = styled(Loader2)`
  animation: spin 1s linear infinite;
`;

export default Button;