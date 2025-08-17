# School ERP System

A comprehensive Enterprise Resource Planning system for schools that manages student information, fees, attendance, and more.

## Features

- Student Management
  - Student profiles and details
  - Admission management
  - Academic records
- Fee Management
  - Fee structure
  - Payment tracking
  - Payment history
- Attendance Management
- Class Management
- Report Generation
- User Authentication and Authorization

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```
3. Set up environment variables:
   - Create `.env` file in backend directory
   - Add necessary environment variables

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm start
   ```

## Project Structure

```
school-erp/
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
└── README.md
``` 