const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Residence = require('../models/Residence');
const Room = require('../models/Room');

const sampleResidences = [
  // Quigney, East London
  {
    name: "Majestic Residence",
    location: "Quigney, East London",
    description: "Modern student accommodation with excellent amenities and security.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Recreation Area", "Parking"],
    priceRange: { min: 3950, max: 5200 },
    images: ["https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=800"],
    contactInfo: {
      phone: "+27 43 123 4567",
      email: "info@majesticresidence.co.za",
      address: "123 Majestic Street, Quigney, East London"
    },
    rules: ["No smoking", "No pets", "Quiet hours 10PM-6AM", "Visitors must sign in"]
  },
  {
    name: "Elwandle Residence",
    location: "Quigney, East London",
    description: "Affordable student housing with basic amenities and friendly community.",
    amenities: ["WiFi", "Security", "Laundry", "Common Kitchen"],
    priceRange: { min: 3500, max: 4800 },
    images: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800"],
    contactInfo: {
      phone: "+27 43 234 5678",
      email: "info@elwandleresidence.co.za",
      address: "456 Elwandle Street, Quigney, East London"
    },
    rules: ["No smoking", "Respect common areas", "Quiet hours 10PM-6AM"]
  },
  {
    name: "Ekhaya Residence",
    location: "Quigney, East London",
    description: "Home away from home with excellent support and facilities.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Gym", "Meals Included"],
    priceRange: { min: 4200, max: 5500 },
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
    contactInfo: {
      phone: "+27 43 345 6789",
      email: "info@ekhayaresidence.co.za",
      address: "789 Ekhaya Street, Quigney, East London"
    },
    rules: ["No smoking", "No alcohol", "Quiet hours 9PM-6AM", "Study hours respected"]
  },
  {
    name: "Embassy Residence",
    location: "Quigney, East London",
    description: "Premium student accommodation with luxury amenities.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Gym", "Pool", "Recreation Area"],
    priceRange: { min: 5000, max: 6500 },
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
    contactInfo: {
      phone: "+27 43 456 7890",
      email: "info@embassyresidence.co.za",
      address: "321 Embassy Street, Quigney, East London"
    },
    rules: ["No smoking", "Visitors register at reception", "Quiet hours 10PM-6AM"]
  },
  {
    name: "Kamva Residence",
    location: "Quigney, East London",
    description: "Modern student living with focus on academic success.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Library", "Computer Lab"],
    priceRange: { min: 4000, max: 5300 },
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    contactInfo: {
      phone: "+27 43 567 8901",
      email: "info@kamvaresidence.co.za",
      address: "654 Kamva Street, Quigney, East London"
    },
    rules: ["No smoking", "Study hours enforced", "Quiet hours 9PM-6AM"]
  },

  // Southernwood
  {
    name: "Belmar Residence",
    location: "Southernwood, East London",
    description: "Comfortable and secure student accommodation in peaceful Southernwood.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Garden", "Parking"],
    priceRange: { min: 3800, max: 5000 },
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    contactInfo: {
      phone: "+27 43 678 9012",
      email: "info@belmarresidence.co.za",
      address: "123 Belmar Road, Southernwood, East London"
    },
    rules: ["No smoking", "No loud music after 9PM", "Visitors must be accompanied"]
  },
  {
    name: "The Orchids",
    location: "Southernwood, East London",
    description: "Beautiful student residence surrounded by gardens and nature.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Garden", "Outdoor Areas"],
    priceRange: { min: 4100, max: 5400 },
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],
    contactInfo: {
      phone: "+27 43 789 0123",
      email: "info@theorchids.co.za",
      address: "456 Orchid Lane, Southernwood, East London"
    },
    rules: ["No smoking", "Respect the gardens", "Quiet hours 10PM-6AM"]
  },
  {
    name: "Melville Heights",
    location: "Southernwood, East London",
    description: "Elevated student living with panoramic views of East London.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Gym", "Rooftop Terrace"],
    priceRange: { min: 4500, max: 6000 },
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"],
    contactInfo: {
      phone: "+27 43 890 1234",
      email: "info@melvilleheights.co.za",
      address: "789 Heights Drive, Southernwood, East London"
    },
    rules: ["No smoking", "Quiet hours 10PM-6AM", "Respect common areas"]
  },
  {
    name: "Grand Select",
    location: "Southernwood, East London",
    description: "Premium student accommodation with personalized services.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Concierge", "Housekeeping"],
    priceRange: { min: 5200, max: 7000 },
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"],
    contactInfo: {
      phone: "+27 43 901 2345",
      email: "info@grandselect.co.za",
      address: "321 Grand Avenue, Southernwood, East London"
    },
    rules: ["No smoking", "Formal dress code in common areas", "Quiet hours 9PM-6AM"]
  },
  {
    name: "Cider Heights",
    location: "Southernwood, East London",
    description: "Modern student accommodation with focus on comfort and convenience.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Convenience Store", "Café"],
    priceRange: { min: 4300, max: 5700 },
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
    contactInfo: {
      phone: "+27 43 012 3456",
      email: "info@ciderheights.co.za",
      address: "654 Cider Street, Southernwood, East London"
    },
    rules: ["No smoking", "No parties in rooms", "Quiet hours 10PM-6AM"]
  },

  // East London CBD
  {
    name: "Six On Station",
    location: "East London CBD",
    description: "Urban student living in the heart of East London's business district.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Gym", "Restaurant"],
    priceRange: { min: 4800, max: 6200 },
    images: ["https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800"],
    contactInfo: {
      phone: "+27 43 123 4567",
      email: "info@sixonstation.co.za",
      address: "6 Station Street, East London CBD"
    },
    rules: ["No smoking", "Professional environment", "Quiet hours 10PM-6AM"]
  },
  {
    name: "Grand House",
    location: "East London CBD",
    description: "Historic building converted to modern student accommodation.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Heritage Features"],
    priceRange: { min: 4200, max: 5600 },
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
    contactInfo: {
      phone: "+27 43 234 5678",
      email: "info@grandhouse.co.za",
      address: "123 Grand Street, East London CBD"
    },
    rules: ["No smoking", "Respect heritage features", "Quiet hours 10PM-6AM"]
  },
  {
    name: "Tower House",
    location: "East London CBD",
    description: "High-rise student accommodation with city views.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Sky Lounge", "City Views"],
    priceRange: { min: 5000, max: 6800 },
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
    contactInfo: {
      phone: "+27 43 345 6789",
      email: "info@towerhouse.co.za",
      address: "456 Tower Street, East London CBD"
    },
    rules: ["No smoking", "Quiet hours 9PM-6AM", "Elevator etiquette"]
  },
  {
    name: "Caxton Residence",
    location: "East London CBD",
    description: "Affordable student housing with easy access to university transport.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "Transport Hub"],
    priceRange: { min: 3700, max: 4900 },
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"],
    contactInfo: {
      phone: "+27 43 456 7890",
      email: "info@caxtonresidence.co.za",
      address: "789 Caxton Street, East London CBD"
    },
    rules: ["No smoking", "Keep common areas clean", "Quiet hours 10PM-6AM"]
  },
  {
    name: "River View",
    location: "East London CBD",
    description: "Stunning river views with modern amenities for student comfort.",
    amenities: ["WiFi", "Security", "Laundry", "Study Room", "River Views", "Balconies"],
    priceRange: { min: 5300, max: 7200 },
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
    contactInfo: {
      phone: "+27 43 567 8901",
      email: "info@riverview.co.za",
      address: "321 River Road, East London CBD"
    },
    rules: ["No smoking", "Balcony safety rules", "Quiet hours 10PM-6AM"]
  }
];

const sampleUsers = [
  {
    name: "John Smith",
    email: "john.landlord@example.com",
    password: "password123",
    role: "landlord",
    residenceName: "Majestic Residence",
    location: "Quigney, East London",
    proofOfResidence: "uploads/documents/sample-proof.pdf",
    isVerified: true
  },
  {
    name: "Sarah Johnson",
    email: "sarah.landlord@example.com",
    password: "password123",
    role: "landlord",
    residenceName: "The Orchids",
    location: "Southernwood, East London",
    proofOfResidence: "uploads/documents/sample-proof.pdf",
    isVerified: true
  },
  {
    name: "Michael Brown",
    email: "michael.student@example.com",
    password: "password123",
    role: "student",
    studentNumber: "ST2024001",
    gender: "male",
    hasDisability: false
  },
  {
    name: "Emily Davis",
    email: "emily.student@example.com",
    password: "password123",
    role: "student",
    studentNumber: "ST2024002",
    gender: "female",
    hasDisability: true
  },
  {
    name: "David Wilson",
    email: "david.landlord@example.com",
    password: "password123",
    role: "landlord",
    residenceName: "Six On Station",
    location: "East London CBD",
    proofOfResidence: "uploads/documents/sample-proof.pdf",
    isVerified: true
  }
];

const createSampleRooms = (residenceId, residenceName) => {
  const rooms = [];
  const floors = residenceName.includes('Tower') || residenceName.includes('Heights') ? 5 : 3;
  
  for (let floor = 0; floor < floors; floor++) {
    const roomsPerFloor = 8;
    
    for (let roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
      const roomNumber = `${floor}${roomNum.toString().padStart(2, '0')}`;
      const isDouble = roomNum % 3 === 0; // Every 3rd room is double
      
      const room = {
        residence: residenceId,
        roomNumber,
        floor,
        type: isDouble ? 'double' : 'single',
        numberOfBeds: isDouble ? 2 : 1,
        price: isDouble ? 5000 + (floor * 200) : 4000 + (floor * 150),
        allowedGender: floor === 0 ? 'any' : (floor % 2 === 1 ? 'female' : 'male'),
        isAccessible: floor === 0 && roomNum <= 2, // First 2 rooms on ground floor
        floorRestrictions: {
          femaleOnly: floor === 1,
          disabilityAccess: floor === 0,
          groundFloorOnly: false
        },
        amenities: ["WiFi", "Desk", "Wardrobe", "Bed"],
        description: `${isDouble ? 'Double' : 'Single'} room on floor ${floor}`,
        occupants: [],
        isOccupied: false,
        isFull: false,
        isActive: true
      };
      
      rooms.push(room);
    }
  }
  
  return rooms;
};

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Residence.deleteMany({});
    await Room.deleteMany({});

    // Create sample users
    console.log('Creating sample users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Get landlords
    const landlords = createdUsers.filter(user => user.role === 'landlord');

    // Create residences with landlords
    console.log('Creating sample residences...');
    const residencesWithLandlords = sampleResidences.map((residence, index) => ({
      ...residence,
      landlord: landlords[index % landlords.length]._id,
      totalRooms: 0,
      occupiedRooms: 0,
      availableRooms: 0,
      isActive: true
    }));

    const createdResidences = await Residence.insertMany(residencesWithLandlords);
    console.log(`Created ${createdResidences.length} residences`);

    // Create rooms for each residence
    console.log('Creating sample rooms...');
    let allRooms = [];
    
    for (const residence of createdResidences) {
      const rooms = createSampleRooms(residence._id, residence.name);
      allRooms = [...allRooms, ...rooms];
    }

    const createdRooms = await Room.insertMany(allRooms);
    console.log(`Created ${createdRooms.length} rooms`);

    // Update residence room counts
    console.log('Updating residence room counts...');
    for (const residence of createdResidences) {
      const roomCount = createdRooms.filter(room => 
        room.residence.toString() === residence._id.toString()
      ).length;
      
      await Residence.findByIdAndUpdate(residence._id, {
        totalRooms: roomCount,
        availableRooms: roomCount
      });
    }

    console.log('Database seeding completed successfully!');
    console.log('\nSample Accounts:');
    console.log('Landlords:');
    landlords.forEach(landlord => {
      console.log(`  Email: ${landlord.email}, Password: password123`);
    });
    
    const students = createdUsers.filter(user => user.role === 'student');
    console.log('\nStudents:');
    students.forEach(student => {
      console.log(`  Email: ${student.email}, Password: password123`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };