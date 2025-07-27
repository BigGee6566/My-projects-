# 🏠 PlaceMe - Student Accommodation System

A comprehensive web platform designed to connect university students in South Africa with verified and affordable student housing.

## 🌟 Features

### 👨‍🎓 **Student Features**
- **Smart Registration** - Register with student details including disability requirements
- **Intelligent Search** - Find accommodation by location, funding type (NSFAS/Self-funded)
- **Auto-Allocation** - Automatic room assignment based on gender, disability, and floor rules
- **Application Tracking** - Real-time status updates (Pending/Accepted/Allocated)
- **Room Management** - View allocated room details and request changes
- **Messaging System** - Direct communication with landlords

### 🧑‍💼 **Landlord Features**
- **Verified Registration** - Upload proof of residence for verification
- **Property Management** - Add and manage multiple residences
- **Smart Room System** - Configure floor restrictions (e.g., Ground floor for disabled students)
- **Application Management** - Review and approve student applications
- **Occupancy Reports** - Track room allocation and availability
- **Messaging System** - Communicate with students

### 🔐 **System Rules**
- **Gender-Based Floor Assignment** - Configurable floor restrictions
- **Disability Accommodation** - Ground floor priority for students with disabilities
- **Auto-Allocation Algorithm** - Smart room assignment based on requirements
- **NSFAS Support** - Support for both NSFAS-funded and self-funded students

## 🏗️ **Tech Stack**

### **Backend**
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **Multer** for file uploads
- **Express Validator** for input validation
- **Bcrypt** for password hashing

### **Frontend**
- **React 18** with TypeScript
- **Styled Components** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management
- **Lucide React** for icons

## 📍 **Sample Locations & Residences**

### **Quigney, East London**
- Majestic Residence
- Elwandle Residence
- Ekhaya Residence
- Embassy Residence
- Kamva Residence

### **Southernwood, East London**
- Belmar Residence
- The Orchids
- Melville Heights
- Grand Select
- Cider Heights

### **East London CBD**
- Six On Station
- Grand House
- Tower House
- Caxton Residence
- River View

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd placeme-student-accommodation
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placeme
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Seed the database** (Optional)
```bash
cd server
node scripts/seedData.js
```

6. **Start the application**
```bash
# From root directory
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend application on `http://localhost:3000`

## 🔑 **Sample Accounts**

After running the seed script, you can use these accounts:

### **Landlords**
- Email: `john.landlord@example.com` | Password: `password123`
- Email: `sarah.landlord@example.com` | Password: `password123`
- Email: `david.landlord@example.com` | Password: `password123`

### **Students**
- Email: `michael.student@example.com` | Password: `password123`
- Email: `emily.student@example.com` | Password: `password123`

## 📱 **Usage**

### **For Students:**
1. Register with your student details
2. Search for accommodation by location or funding type
3. Apply for suitable residences
4. Get automatically allocated based on your requirements
5. Communicate with landlords via messaging

### **For Landlords:**
1. Register and upload verification documents
2. Add your residence and room details
3. Configure floor restrictions and gender assignments
4. Review and approve student applications
5. Manage occupancy and communicate with students

## 🏗️ **Project Structure**

```
placeme-student-accommodation/
├── server/                 # Backend API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Database scripts
│   └── uploads/           # File uploads
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── styles/        # Global styles and theme
│   │   └── App.tsx        # Main app component
└── package.json           # Root package file
```

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/register/student` - Student registration
- `POST /api/auth/register/landlord` - Landlord registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Residences**
- `GET /api/residences` - Get all residences
- `GET /api/residences/:id` - Get residence details
- `POST /api/residences` - Create residence (landlord)
- `GET /api/residences/featured/list` - Get featured residences

### **Applications**
- `POST /api/applications` - Submit application (student)
- `GET /api/applications/my` - Get student's applications
- `PUT /api/applications/:id/status` - Update application status (landlord)

### **Rooms**
- `GET /api/rooms/residence/:id` - Get rooms for residence
- `POST /api/rooms` - Create room (landlord)
- `PUT /api/rooms/:id/restrictions` - Update room restrictions

### **Messages**
- `POST /api/messages` - Send message
- `GET /api/messages/inbox` - Get inbox messages
- `GET /api/messages/sent` - Get sent messages

## 🎨 **Design System**

### **Colors**
- **Primary**: Purple (`#8B5FBF`)
- **Secondary**: Blue (`#5F8BF4`)
- **Success**: Green (`#10B981`)
- **Warning**: Yellow (`#F59E0B`)
- **Error**: Red (`#EF4444`)

### **Typography**
- **Primary Font**: Inter (body text)
- **Secondary Font**: Poppins (headings)

## 🚧 **Development Status**

### ✅ **Completed**
- Full backend API with authentication
- Database models and relationships
- Auto-allocation algorithm
- Frontend architecture and styling
- Home page with featured residences
- Navigation and layout components
- Responsive design system

### 🔨 **In Progress**
- Registration and login forms
- Property browsing and details
- Student and landlord dashboards
- Messaging system interface
- Application management interface

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License.

## 🙋‍♂️ **Support**

For support and questions, please contact the development team or create an issue in the repository.

---

**PlaceMe** - Your trusted partner for student accommodation in South Africa! 🇿🇦