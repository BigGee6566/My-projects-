import React from 'react';
import styled from 'styled-components';

const Properties: React.FC = () => {
  return (
    <Container>
      <div className="container">
        <h1>Properties</h1>
        <p>Browse all available student accommodation properties.</p>
        <p>This page is under development...</p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  min-height: 60vh;
`;

export default Properties;