# Chat Application

A real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

## Try it out
Deployed link:- [https://chatterbox-4r53.onrender.com/]

### 📸 Screenshots

#### JWT Authentication

![Login Screenshot](docs/images/login.png)

#### Homepage

![Homepage Screenshot](docs/images/homepage-demo.png)

#### Search

![Homepage Screenshot](docs/images/homepage-demo.png)

#### Single Chatting

![Chat Screenshot](docs/images/chat-demo.png)

#### Group Chatting

![Chat Screenshot](docs/images/chat-demo.png)



## Features

- Real-time messaging
- User authentication
- One-on-one and group chats
- Notifications
- Online/offline status
- Responsive design

## Tech Stack

- **Frontend**: React, Vite, Chakra UI, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB
- **Authentication**: JWT
- **Real-time Communication**: Socket.io

## Deployment to Render

### Prerequisites

- A Render account (https://render.com)
- MongoDB Atlas account for the database
- Cloudinary account for image hosting (optional)

### Deployment Steps

1. **Fork this repository** to your GitHub account.

2. **Create a new Web Service** on Render:
   - Connect your GitHub account
   - Select this repository
   - Choose "Node" as the runtime
   - Use the following settings:
     - **Build Command**: `npm install && cd frontend && npm install && npm run build`
     - **Start Command**: `npm start`

3. **Configure Environment Variables** in the Render dashboard:
   - `MONGO_URI`: Your MongoDB connection string from MongoDB Atlas
   - `JWT_SECRET`: A secret string for JWT token signing
   - `CLOUDINARY_URL`: Your Cloudinary URL (if using image uploads)
   - `FRONTEND_URL`: Your frontend URL on Render (e.g., `https://your-app-name.onrender.com`)

4. **Wait for deployment** to complete.

5. Your app will be live at the URL provided by Render!

### Notes

- The frontend is built and served from the backend using Express static middleware (single deployment)
- Socket.io is configured to work in production environment
- Both frontend and backend run on the same domain, preventing CORS issues
- The application automatically detects the production environment and adjusts API calls accordingly

## Local Development

To run the application locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```
3. Create a `.env` file in the root directory with the required environment variables
4. Start the development servers:
   ```bash
   # Terminal 1: Start backend
   npm run server
   
   # Terminal 2: Start frontend
   cd frontend && npm run dev
   ```

## Troubleshooting

- If the chat functionality doesn't work after deployment, check that Socket.io is properly connecting to the backend
- Make sure all environment variables are correctly set in the Render dashboard
- Verify that your MongoDB connection string is accessible from Render's servers