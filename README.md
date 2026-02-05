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

```

```
