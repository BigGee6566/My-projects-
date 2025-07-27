import React from 'react';
import styled from 'styled-components';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <Container>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          type={notification.type}
          className="animate-slide-down"
        >
          <IconWrapper type={notification.type}>
            {getIcon(notification.type)}
          </IconWrapper>
          
          <Content>
            <Title>{notification.title}</Title>
            {notification.message && (
              <Message>{notification.message}</Message>
            )}
          </Content>
          
          <CloseButton onClick={() => removeNotification(notification.id)}>
            <X size={16} />
          </CloseButton>
        </NotificationCard>
      ))}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 400px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    top: ${({ theme }) => theme.spacing.md};
    max-width: none;
  }
`;

const NotificationCard = styled.div<{ type: string }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-left: 4px solid ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.status.success;
      case 'warning':
        return theme.colors.status.warning;
      case 'error':
        return theme.colors.status.error;
      case 'info':
        return theme.colors.status.info;
      default:
        return theme.colors.status.info;
    }
  }};
`;

const IconWrapper = styled.div<{ type: string }>`
  color: ${({ theme, type }) => {
    switch (type) {
      case 'success':
        return theme.colors.status.success;
      case 'warning':
        return theme.colors.status.warning;
      case 'error':
        return theme.colors.status.error;
      case 'info':
        return theme.colors.status.info;
      default:
        return theme.colors.status.info;
    }
  }};
  flex-shrink: 0;
  margin-top: 2px;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export default NotificationContainer;