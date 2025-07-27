import React from 'react';
import styled from 'styled-components';

const Login: React.FC = () => {
  return (
    <Container>
      <div className="container">
        <h1>Login</h1>
        <p>Sign in to your PlaceMe account.</p>
        <p>This page is under development...</p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  min-height: 60vh;
`;

export default Login;