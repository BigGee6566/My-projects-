import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search, MapPin, Star, Users, Shield, CheckCircle } from 'lucide-react';
import axios from 'axios';

// Components
import Button from '../components/common/Button';
import ResidenceCard from '../components/residence/ResidenceCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Types
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

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fundingType, setFundingType] = useState('');
  const [featuredResidences, setFeaturedResidences] = useState<Residence[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch featured residences on component mount
  useEffect(() => {
    const fetchFeaturedResidences = async () => {
      try {
        const response = await axios.get('/residences/featured/list');
        setFeaturedResidences(response.data.residences);
      } catch (error) {
        console.error('Failed to fetch featured residences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedResidences();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (fundingType) params.append('funding', fundingType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent className="container">
          <HeroText>
            <h1>Find Your Perfect Student Home</h1>
            <p>
              Discover verified, affordable student accommodation across South Africa. 
              Whether you're NSFAS-funded or self-funded, PlaceMe connects you with your ideal home away from home.
            </p>
          </HeroText>
          
          <SearchSection>
            <SearchForm onSubmit={handleSearch}>
              <SearchInputWrapper>
                <Search size={20} />
                <SearchInput
                  type="text"
                  placeholder="Search by residence name, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchInputWrapper>
              
              <FundingSelect
                value={fundingType}
                onChange={(e) => setFundingType(e.target.value)}
              >
                <option value="">All Funding Types</option>
                <option value="nsfas">NSFAS</option>
                <option value="self-funded">Self-Funded</option>
              </FundingSelect>
              
              <Button type="submit" variant="primary" size="lg">
                Search
              </Button>
            </SearchForm>
          </SearchSection>
        </HeroContent>
      </HeroSection>

      {/* Featured Residences Section */}
      <FeaturedSection>
        <div className="container">
          <SectionHeader>
            <h2>Featured Residences</h2>
            <p>Discover top-rated student accommodation options</p>
          </SectionHeader>
          
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : (
            <ResidenceGrid>
              {featuredResidences.map((residence) => (
                <ResidenceCard
                  key={residence._id}
                  residence={residence}
                />
              ))}
            </ResidenceGrid>
          )}
          
          <ViewAllContainer>
            <Button as={Link} to="/properties" variant="outline" size="lg">
              View All Properties
            </Button>
          </ViewAllContainer>
        </div>
      </FeaturedSection>

      {/* How It Works Section */}
      <HowItWorksSection>
        <div className="container">
          <SectionHeader>
            <h2>How PlaceMe Works</h2>
            <p>Simple steps to find your perfect student accommodation</p>
          </SectionHeader>
          
          <WorkflowContainer>
            <WorkflowColumn>
              <h3>For Students</h3>
              <WorkflowSteps>
                <WorkflowStep>
                  <StepNumber>1</StepNumber>
                  <StepContent>
                    <h4>Register & Verify</h4>
                    <p>Create your student account with your details</p>
                  </StepContent>
                </WorkflowStep>
                
                <WorkflowStep>
                  <StepNumber>2</StepNumber>
                  <StepContent>
                    <h4>Search & Apply</h4>
                    <p>Browse residences and apply for rooms</p>
                  </StepContent>
                </WorkflowStep>
                
                <WorkflowStep>
                  <StepNumber>3</StepNumber>
                  <StepContent>
                    <h4>Get Allocated</h4>
                    <p>Automatic room allocation based on your needs</p>
                  </StepContent>
                </WorkflowStep>
                
                <WorkflowStep>
                  <StepNumber>4</StepNumber>
                  <StepContent>
                    <h4>Move In</h4>
                    <p>Settle into your new home away from home</p>
                  </StepContent>
                </WorkflowStep>
              </WorkflowSteps>
            </WorkflowColumn>
            
            <WorkflowColumn>
              <h3>For Landlords</h3>
              <WorkflowSteps>
                <WorkflowStep>
                  <StepNumber>1</StepNumber>
                  <StepContent>
                    <h4>Register & Verify</h4>
                    <p>Create your landlord account and upload verification documents</p>
                  </StepContent>
                </WorkflowStep>
                
                <WorkflowStep>
                  <StepNumber>2</StepNumber>
                  <StepContent>
                    <h4>List Property</h4>
                    <p>Add your residence and room details</p>
                  </StepContent>
                </WorkflowStep>
                
                <WorkflowStep>
                  <StepNumber>3</StepNumber>
                  <StepContent>
                    <h4>Manage Applications</h4>
                    <p>Review and approve student applications</p>
                  </StepContent>
                </WorkflowStep>
                
                <WorkflowStep>
                  <StepNumber>4</StepNumber>
                  <StepContent>
                    <h4>Grow Your Business</h4>
                    <p>Connect with verified students and grow your occupancy</p>
                  </StepContent>
                </WorkflowStep>
              </WorkflowSteps>
            </WorkflowColumn>
          </WorkflowContainer>
        </div>
      </HowItWorksSection>

      {/* Features Section */}
      <FeaturesSection>
        <div className="container">
          <SectionHeader>
            <h2>Why Choose PlaceMe?</h2>
            <p>Your trusted partner for student accommodation</p>
          </SectionHeader>
          
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <Shield size={32} />
              </FeatureIcon>
              <h4>Verified Properties</h4>
              <p>All properties and landlords are thoroughly verified for your safety and peace of mind.</p>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <Users size={32} />
              </FeatureIcon>
              <h4>Smart Allocation</h4>
              <p>Our system automatically allocates rooms based on your preferences and requirements.</p>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <MapPin size={32} />
              </FeatureIcon>
              <h4>Prime Locations</h4>
              <p>Find accommodation in convenient locations close to universities and amenities.</p>
            </FeatureCard>
            
            <FeatureCard>
              <FeatureIcon>
                <CheckCircle size={32} />
              </FeatureIcon>
              <h4>NSFAS Support</h4>
              <p>We support both NSFAS-funded and self-funded students with transparent pricing.</p>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <div className="container">
          <SectionHeader>
            <h2>What Students Say</h2>
            <p>Real experiences from our student community</p>
          </SectionHeader>
          
          <TestimonialsGrid>
            <TestimonialCard>
              <TestimonialContent>
                <StarRating>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </StarRating>
                <p>
                  "PlaceMe made finding accommodation so easy! I got allocated to a perfect room 
                  in Majestic Residence within days of applying. The process was seamless."
                </p>
              </TestimonialContent>
              <TestimonialAuthor>
                <strong>Thabo M.</strong>
                <span>Engineering Student, UFH</span>
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialContent>
                <StarRating>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </StarRating>
                <p>
                  "As a NSFAS student, I was worried about finding affordable accommodation. 
                  PlaceMe connected me with exactly what I needed in my budget."
                </p>
              </TestimonialContent>
              <TestimonialAuthor>
                <strong>Nomsa K.</strong>
                <span>Business Student, WSU</span>
              </TestimonialAuthor>
            </TestimonialCard>
            
            <TestimonialCard>
              <TestimonialContent>
                <StarRating>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </StarRating>
                <p>
                  "The smart allocation system is amazing! It considered my disability requirements 
                  and placed me on the ground floor with accessible facilities."
                </p>
              </TestimonialContent>
              <TestimonialAuthor>
                <strong>Sarah L.</strong>
                <span>Medical Student, UFH</span>
              </TestimonialAuthor>
            </TestimonialCard>
          </TestimonialsGrid>
        </div>
      </TestimonialsSection>

      {/* Call to Action Section */}
      <CTASection>
        <div className="container">
          <CTAContent>
            <h2>Ready to Find Your Perfect Home?</h2>
            <p>Join thousands of students who have found their ideal accommodation through PlaceMe</p>
            <CTAButtons>
              <Button as={Link} to="/register/student" variant="primary" size="lg">
                Apply Now
              </Button>
              <Button as={Link} to="/register/landlord" variant="outline" size="lg">
                List Your Property
              </Button>
            </CTAButtons>
          </CTAContent>
        </div>
      </CTASection>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  /* Container styles will be added here */
`;

const HeroSection = styled.section`
  background: ${({ theme }) => theme.colors.primary.gradient};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
  min-height: 60vh;
  display: flex;
  align-items: center;
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing['3xl']};
`;

const HeroText = styled.div`
  max-width: 600px;

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.inverse};
    opacity: 0.9;
  }
`;

const SearchSection = styled.div`
  width: 100%;
  max-width: 800px;
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.primary};

  svg {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const FundingSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.background.primary};
`;

const FeaturedSection = styled.section`
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};

  h2 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
`;

const ResidenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const ViewAllContainer = styled.div`
  text-align: center;
`;

const HowItWorksSection = styled.section`
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
`;

const WorkflowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing['4xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['3xl']};
  }
`;

const WorkflowColumn = styled.div`
  h3 {
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const WorkflowSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const WorkflowStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.text.inverse};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  flex-shrink: 0;
`;

const StepContent = styled.div`
  h4 {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  p {
    margin-bottom: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  h4 {
    margin: ${({ theme }) => theme.spacing.md} 0;
  }

  p {
    margin-bottom: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const FeatureIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
`;

const TestimonialsSection = styled.section`
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const TestimonialCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const TestimonialContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  p {
    font-style: italic;
    margin-bottom: 0;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
  color: ${({ theme }) => theme.colors.status.warning};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TestimonialAuthor = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const CTASection = styled.section`
  padding: ${({ theme }) => theme.spacing['5xl']} 0;
  background: ${({ theme }) => theme.colors.primary.gradient};
  color: ${({ theme }) => theme.colors.text.inverse};
`;

const CTAContent = styled.div`
  text-align: center;

  h2 {
    color: ${({ theme }) => theme.colors.text.inverse};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.inverse};
    opacity: 0.9;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

export default Home;