# MERN Pet Adoption App

A full-stack web application for pet adoption built with MongoDB, Express, React, and Node.js (MERN stack). This application allows users to browse available pets and admins to manage pet listings with image uploads.

## Features

- **User Authentication**: Register/login system with JWT-based authentication
- **Email Verification**: New accounts require email verification before login
- **Password Reset**: Secure password reset functionality via email
- **Pet Browsing**: View available pets with images, descriptions, and details
- **Advanced Search & Pagination**: Filter pets by name, species, age range, and location with paginated results
- **Adoption Requests**: Users can submit adoption requests for pets with optional messages
- **Admin Dashboard**:
  - Add new pets with image uploads
  - Edit existing pet information
  - Delete pets with confirmation
  - Upload and display pet photos
  - Manage adoption requests (approve/reject)
- **Toast Notifications**: Real-time feedback for all user actions
- **Responsive Design**: Clean UI with intuitive navigation
- **Role-Based Access**: Admin-only features protected with role checks

## Tech Stack

### Backend

- **Node.js** & **Express.js**: RESTful API server
- **MongoDB** & **Mongoose**: Database and ODM
- **JWT**: Authentication tokens
- **Multer**: File upload handling
- **bcryptjs**: Password hashing

### Frontend

- **React**: UI library with hooks
- **React Router**: Client-side routing
- **Context API**: Global auth state management

## Project Structure

````

## Developer Notes & Next Steps

This project includes Email Verification & Password Reset features for improved security and user experience. Here's what was implemented and how to use it:

- **Email sending / Mailer behavior**: the server attempts to use SMTP if `SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS` are set in `server/.env`. If SMTP verification or sending fails, the server will automatically create an Ethereal test account and resend the message so local development still receives preview links. When Ethereal is used, the server logs a `Preview URL (Ethereal): <url>` line and PUT `/api/adoptions/:id` will include a `mailPreview` field in the JSON response for easy access.

- **How to test email previews locally**:
  - Ensure server is running: `cd server && npm start`
  - Approve an adoption request (admin) via the UI or curl. If SMTP is not configured or fails, the response will include `mailPreview` with a URL you can open to view the message.

- **Recommended SMTP setup for real emails**:
  - Add valid SMTP credentials in `server/.env`:
    - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and optionally `FROM_EMAIL`.
  - Use provider examples (Mailgun, SendGrid, Mailtrap for testing) and ensure credentials are correct to avoid `535 Invalid credentials` errors.

- **Admin account**: create an admin user with the script in `server/scripts/createAdmin.js`:
  ```bash
  ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret ADMIN_NAME=Admin node server/scripts/createAdmin.js
````

- **New/Updated client features**:

  - `ConfirmationModal` component used across admin actions to avoid accidental destructive operations.
  - `MyRequests` page for users to view their adoption requests and statuses.

- **Next development priorities** (short-term):
  1. Add unit/integration tests for adoption flow and mailer behavior (E2E with Cypress recommended).
  2. Migrate image storage to cloud (S3/Cloudinary) for production readiness.
  3. Add CI to run tests and linting on PRs.
  4. Implement user dashboard with adoption history.

If you'd like, I can open a PR with these notes or wire the `mailPreview` into the admin UI for quick access during testing.
mern-pet-adoption/
├── server/
│ ├── src/
│ │ ├── config/
│ │ │ └── db.js # MongoDB connection
│ │ ├── middleware/
│ │ │ └── auth.js # JWT authentication middleware
│ │ ├── models/
│ │ │ ├── Pet.js # Pet schema
│ │ │ ├── User.js # User schema
│ │ │ └── AdoptionRequest.js # Adoption request schema
│ │ ├── routes/
│ │ │ ├── auth.js # Login/register routes
│ │ │ ├── pets.js # Pet CRUD routes
│ │ │ └── adoptions.js # Adoption request routes
│ │ └── server.js # Express app entry point
│ ├── scripts/
│ │ ├── createAdmin.js # Create admin user script
│ │ └── setAdminPassword.js # Reset admin password script
│ ├── uploads/ # Uploaded pet images
│ ├── .env # Environment variables
│ └── package.json
│
└── client/
├── src/
│ ├── components/
│ │ └── AddPetForm.js # Form for adding pets
│ ├── context/
│ │ └── AuthContext.js # Auth state provider
│ ├── pages/
│ │ ├── Home.js # Landing page
│ │ ├── Login.js # Login page
│ │ ├── Register.js # Registration page
│ │ ├── Pets.js # Pet listing with search
│ │ ├── PetDetail.js # Individual pet details
│ │ └── AdminAdoptions.js # Admin adoption management
│ ├── App.js # Main app with routing
│ └── index.js
└── package.json

````

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mern-pet-adoption
````

### 2. Server Setup

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=5001
MONGO_URI=mongodb://localhost:27017/pet_adoption
JWT_SECRET=your_strong_secret_key_here
EOF
```

### 3. Client Setup

```bash
cd ../client
npm install

# (Optional) Create .env for custom API URL
echo "REACT_APP_API_URL=http://localhost:5001" > .env
```

### 4. Create Admin User

```bash
cd ../server
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret ADMIN_NAME=Admin node scripts/createAdmin.js
```

## Running the Application

### Start MongoDB

If running locally:

```bash
mongod
```

### Start the Server

```bash
cd server
npm start
# Server runs on http://localhost:5001
```

### Start the Client

```bash
cd client
npm start
# Client runs on http://localhost:3000
```

## Environment Variables

### Server (.env)

```env
PORT=5001                                          # Server port
MONGO_URI=mongodb://localhost:27017/pet_adoption  # MongoDB connection string
JWT_SECRET=your_strong_secret_key_here            # JWT signing secret
```

### Client (.env)

```env
REACT_APP_API_URL=http://localhost:5001           # Backend API URL
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Pets

- `GET /api/pets` - Get all pets
- `GET /api/pets/:id` - Get single pet
- `POST /api/pets` - Create pet (admin only, multipart/form-data)
- `PUT /api/pets/:id` - Update pet (admin only, multipart/form-data)
- `DELETE /api/pets/:id` - Delete pet (admin only)

### Adoption Requests

- `GET /api/adoptions` - Get adoption requests (admin sees all, users see own)
- `POST /api/adoptions` - Submit adoption request (authenticated users)
- `PUT /api/adoptions/:id` - Update request status (admin only: approved/rejected)

### File Uploads

- `GET /uploads/:filename` - Serve uploaded images

## Usage

### For Regular Users

1. Visit `http://localhost:3000`
2. Click **Register** to create an account
3. Browse available pets on the **Browse Pets** page
4. Click on any pet to view detailed information

### For Admins

1. Login with admin credentials (default: `admin@example.com` / `secret`)
2. Navigate to **Browse Pets**
3. Use the **Add a Pet** form to create new listings with images
4. Use **Edit** and **Delete** buttons to manage existing pets
5. Upload images (max 2MB) when adding or editing pets
6. Click **Adoptions** in the top navigation to manage adoption requests
7. Approve or reject adoption requests, which automatically updates pet status

## Features in Detail

### Image Upload

- Supports common image formats (JPEG, PNG, etc.)
- 2MB file size limit
- Local storage in `/uploads` directory
- Preview before upload
- Images displayed on pet cards and detail pages

### Search & Pagination

- Real-time search by pet name or species
- Advanced filters: species, age range, location
- 6 pets per page
- Navigation with Prev/Next and page numbers

### Admin Controls

- Inline editing with save/cancel
- Delete confirmation modal
- Toast notifications for success/error
- Protected routes requiring admin role
- Adoption request management with approve/reject actions

### Adoption Requests

- Users can submit requests for pets with optional messages
- Admin approval/rejection system
- Automatic pet status updates on approval
- Prevents duplicate requests per user per pet
- Toast notifications for request submission and status updates

## Development Scripts

### Server

- `npm start` - Start server
- `npm run dev` - Start with nodemon (auto-restart)

### Client

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Security Notes

- Passwords are hashed with bcrypt
- JWT tokens for stateless authentication
- Admin-only routes protected with middleware
- CORS enabled for local development
- File upload size limits enforced

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Account profile management
- [ ] Session timeout handling
- [ ] Remember me option
- [ ] Two-factor authentication (optional)
- [ ] Loading states and skeleton screens
- [ ] Error boundaries and error pages
- [ ] Dark mode toggle
- [ ] Mobile-first responsive design improvements
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Pet categories/tags
- [ ] Bulk operations for admins
- [ ] Pet status management (available, adopted, pending)
- [ ] Image gallery for multiple pet photos
- [ ] Pet adoption history tracking
- [ ] Favorite/saved pets functionality
- [ ] User dashboard with adoption history
- [ ] Pet matching algorithm
- [ ] Wishlist notifications
- [ ] Share pet listings on social media
- [ ] Admin analytics dashboard
- [ ] User management (view/edit users)
- [ ] Email notifications for admins
- [ ] Bulk import/export pets
- [ ] Admin activity logs
- [ ] In-app messaging between users and admins
- [ ] Email notifications for adoption updates
- [ ] SMS notifications (optional)
- [ ] Newsletter subscription
- [ ] Cloud storage for images (S3/Cloudinary)
- [ ] Database optimization and indexing
- [ ] Redis caching for performance
- [ ] CDN setup for static assets
- [ ] Load balancing and horizontal scaling
- [ ] Database backup and recovery
- [ ] Input validation and sanitization
- [ ] Rate limiting and DDoS protection
- [ ] HTTPS enforcement
- [ ] GDPR compliance (data privacy)
- [ ] Security audit and penetration testing
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit tests for components and functions
- [ ] Integration tests for API endpoints
- [ ] End-to-end testing with Cypress
- [ ] Performance testing and optimization
- [ ] Code coverage reporting
- [ ] CI/CD pipeline setup

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default 27017)

### Port Already in Use

```bash
# Find process using port 5001
lsof -i :5001
# Kill the process
kill <PID>
```

### Missing Dependencies

```bash
# Reinstall server dependencies
cd server && rm -rf node_modules && npm install

# Reinstall client dependencies
cd client && rm -rf node_modules && npm install
```

### Image Upload Not Working

- Check `/uploads` directory exists in server root
- Verify file size is under 2MB
- Ensure multer is installed: `npm list multer`

## License

MIT

## Contributors

Jordan Bradley

---

**Note**: This is a development setup. For production deployment, consider:

- Using environment-specific configs
- Enabling HTTPS
- Setting up proper CORS policies
- Using a cloud database (MongoDB Atlas)
- Implementing rate limiting
- Adding input validation and sanitization
- Using a CDN for static assets
