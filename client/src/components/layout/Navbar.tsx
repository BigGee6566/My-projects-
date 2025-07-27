import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <Nav>
      <div className="container">
        <NavContent>
          <Logo>
            <Link to="/">PlaceMe</Link>
          </Logo>

          <DesktopMenu>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/properties">Properties</NavLink>
            <NavLink to="/how-it-works">How it Works</NavLink>
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          </DesktopMenu>

          <DesktopAuth>
            {user ? (
              <UserMenu>
                <UserInfo>
                  <User size={16} />
                  <span>{user.name}</span>
                </UserInfo>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut size={16} />
                  Logout
                </Button>
              </UserMenu>
            ) : (
              <AuthButtons>
                <Button as={Link} to="/login" variant="ghost" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  Register
                </Button>
              </AuthButtons>
            )}
          </DesktopAuth>

          <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </NavContent>

        {isMenuOpen && (
          <MobileMenu>
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/properties" onClick={() => setIsMenuOpen(false)}>
              Properties
            </MobileNavLink>
            <MobileNavLink to="/how-it-works" onClick={() => setIsMenuOpen(false)}>
              How it Works
            </MobileNavLink>
            {user && (
              <MobileNavLink to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </MobileNavLink>
            )}
            
            <MobileAuthSection>
              {user ? (
                <>
                  <UserInfo>
                    <User size={16} />
                    <span>{user.name}</span>
                  </UserInfo>
                  <Button onClick={handleLogout} variant="outline" size="sm" fullWidth>
                    <LogOut size={16} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="ghost" 
                    size="sm" 
                    fullWidth
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Button>
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="primary" 
                    size="sm" 
                    fullWidth
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Button>
                </>
              )}
            </MobileAuthSection>
          </MobileMenu>
        )}
      </div>
    </Nav>
  );
};

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const Logo = styled.div`
  a {
    font-family: ${({ theme }) => theme.typography.fontFamily.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
  }
`;

const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const DesktopAuth = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const MobileAuthSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export default Navbar;