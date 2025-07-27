import React from 'react';
import styled from 'styled-components';

const LandlordRegister: React.FC = () => {
  return (
    <Container>
      <div className="container">
        <h1>Landlord Registration</h1>
        <p>Create your landlord account to list properties.</p>
        <p>This page is under development...</p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  min-height: 60vh;
`;

export default LandlordRegister;