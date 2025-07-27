import React from 'react';
import styled from 'styled-components';

const PropertyDetails: React.FC = () => {
  return (
    <Container>
      <div className="container">
        <h1>Property Details</h1>
        <p>Detailed view of a specific property.</p>
        <p>This page is under development...</p>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  min-height: 60vh;
`;

export default PropertyDetails;