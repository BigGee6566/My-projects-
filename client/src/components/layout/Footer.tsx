import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterSection>
            <h4>PlaceMe</h4>
            <p>Your trusted partner for student accommodation in South Africa.</p>
          </FooterSection>
          
          <FooterSection>
            <h5>Quick Links</h5>
            <FooterList>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">Properties</Link></li>
              <li><Link to="/how-it-works">How it Works</Link></li>
            </FooterList>
          </FooterSection>
          
          <FooterSection>
            <h5>Support</h5>
            <FooterList>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </FooterList>
          </FooterSection>
          
          <FooterSection>
            <h5>Account</h5>
            <FooterList>
              <li><Link to="/register/student">Student Registration</Link></li>
              <li><Link to="/register/landlord">Landlord Registration</Link></li>
              <li><Link to="/login">Login</Link></li>
            </FooterList>
          </FooterSection>
        </FooterContent>
        
        <FooterBottom>
          <p>&copy; 2024 PlaceMe. All rights reserved.</p>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.neutral.black};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => theme.spacing['3xl']} 0 ${({ theme }) => theme.spacing.xl} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FooterSection = styled.div`
  h4, h5 {
    color: ${({ theme }) => theme.colors.text.inverse};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    color: ${({ theme }) => theme.colors.text.inverse};
    opacity: 0.8;
  }
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  a {
    color: ${({ theme }) => theme.colors.text.inverse};
    opacity: 0.8;
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral.dark};

  p {
    color: ${({ theme }) => theme.colors.text.inverse};
    opacity: 0.6;
    margin: 0;
  }
`;

export default Footer;