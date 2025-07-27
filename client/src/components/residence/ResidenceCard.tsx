import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MapPin, Users } from 'lucide-react';

interface Residence {
  _id: string;
  name: string;
  location: string;
  description: string;
  images: string[];
  priceRange: {
    min: number;
    max: number;
  };
  amenities: string[];
  totalRooms: number;
  availableRooms: number;
  landlord: {
    name: string;
  };
}

interface ResidenceCardProps {
  residence: Residence;
}

const ResidenceCard: React.FC<ResidenceCardProps> = ({ residence }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <ImageContainer>
        <Image 
          src={residence.images[0] || 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=400'} 
          alt={residence.name}
        />
        <AvailabilityBadge available={residence.availableRooms > 0}>
          {residence.availableRooms > 0 ? 'Available' : 'Full'}
        </AvailabilityBadge>
      </ImageContainer>
      
      <Content>
        <Header>
          <Title>{residence.name}</Title>
          <Location>
            <MapPin size={14} />
            <span>{residence.location}</span>
          </Location>
        </Header>
        
        <Description>{residence.description}</Description>
        
        <Amenities>
          {residence.amenities.slice(0, 3).map((amenity, index) => (
            <Amenity key={index}>{amenity}</Amenity>
          ))}
          {residence.amenities.length > 3 && (
            <Amenity>+{residence.amenities.length - 3} more</Amenity>
          )}
        </Amenities>
        
        <Footer>
          <PriceRange>
            From {formatPrice(residence.priceRange.min)}
          </PriceRange>
          <RoomInfo>
            <Users size={14} />
            <span>{residence.availableRooms}/{residence.totalRooms} available</span>
          </RoomInfo>
        </Footer>
        
        <ViewButton as={Link} to={`/properties/${residence._id}`}>
          View Details
        </ViewButton>
      </Content>
    </Card>
  );
};

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvailabilityBadge = styled.div<{ available: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.inverse};
  background: ${({ theme, available }) => 
    available ? theme.colors.status.success : theme.colors.status.error};
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Amenities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Amenity = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.neutral.light};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PriceRange = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ViewButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primary.dark};
  }
`;

export default ResidenceCard;