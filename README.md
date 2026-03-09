🎨 ##**Imagify - AI Image Generation SaaS**##

**Live Demo**: https://main.d2j76dfbk3ssh3.amplifyapp.com

Imagify is a full-stack MERN (MongoDB, Express, React, Node.js) web application that allows users to transform text prompts into stunning, high-quality images using the Clipdrop API. It features a robust user authentication system, a credit-based economy, and seamless payment integration via Razorpay to purchase additional image generation credits.

**✨ Key Features:** 

1.AI Image Generation: Enter a text prompt and generate high-fidelity images instantly powered by the Clipdrop API.

2.Secure Authentication: User registration and login managed via JSON Web Tokens (JWT) and bcrypt password hashing.

3.Credit System: Users consume credits for every image generated. New users get default free credits upon registration.

4.Integrated Payments: Fully functional Razorpay checkout to purchase premium credit plans (Basic, Advanced, Business).

5.Responsive Design: Beautiful, mobile-friendly UI built from the ground up with Tailwind CSS and Framer Motion for smooth animations.

6.Real-time Notifications: Elegant toast notifications for user feedback (errors, successful payments, image generations) using react-toastify.

**🛠️ Tech Stack** 

**Frontend (/client)** 

  Framework: React.js (via Vite)
  
  Styling: Tailwind CSS
  
  Animations: Framer Motion

  HTTP Client: Axios
  
  State Management: React Context API
  
  Routing: React Router DOM
  
  Notifications: React Toastify
  
  Deployment: AWS Amplify

**Backend (/server)**

  Runtime: Node.js
  
  Framework: Express.js
  
  Database: MongoDB & Mongoose
  
  Authentication: JWT (jsonwebtoken) & bcrypt
  
  External APIs: Clipdrop API (Image Generation), Razorpay API (Payments)
  
  Middleware: CORS, Express JSON parser


**🚀 Getting Started (Local Development)**

This project is set up as a monorepo containing both the frontend client and backend server. Follow these steps to get it running on your local machine.

**Prerequisites**
  Node.js (v18+ recommended)
  
  MongoDB instance (Local or MongoDB Atlas)
  
  Razorpay Account (for test API keys)
  
  Clipdrop API Key

**1. Clone the Repository**
   Bash 
     git clone https://github.com/yourusername/imagify.git
     cd imagify

**2. Setup the Backend**
  Open a terminal and navigate to your backend folder (e.g., the root directory or /server depending on your structure):
  
  Bash
    # Install backend dependencies
    npm install
  
    # Create a .env file
    touch .env
    Backend .env variables:
  
  Code snippet
  PORT=4000
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_super_secret_jwt_key
  CLIPDROP_API=your_clipdrop_api_key
  RAZORPAY_KEY_ID=your_razorpay_key_id
  RAZORPAY_KEY_SECRET=your_razorpay_key_secret
  CURRENCY=INR
  Start the backend server:
  
  Bash
    npm run server # or node server.js
  
**3. Setup the Frontend**
  Open a new terminal window and navigate to the /client directory:
  
  Bash
   cd client
  
  # Install frontend dependencies
  npm install
  
  # Create a .env file
  touch .env
  Frontend .env variables:
  
  Code snippet
  VITE_BACKEND_URL=[your_backendServer_deployed_url] or (http://localhost:4000)
  VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
  Start the Vite development server:
  
    Bash
      npm run dev
      
  The frontend should now be running at http://localhost:5173 and talking to your backend at http://localhost:4000.

**📂 Folder Structure**

Plaintext
imagify/

├── client/                 # React Frontend (Vite)

│   ├── src/

│   │   ├── assets/         # Images and icons

│   │   ├── components/     # Reusable UI components (Navbar, Login, etc.)

│   │   ├── context/        # AppContext for global state

│   │   ├── pages/          # Page views (Home, BuyCredit, Result)

│   │   ├── App.jsx         # Main React component

│   │   └── main.jsx        # React entry point

│   ├── package.json

│   └── vite.config.js

├── models/                 # Mongoose Database Schemas (User, Transaction)

├── controllers/            # Backend business logic (Auth, Payments, Images)

├── routes/                 # Express API routes

├── middlewares/            # Custom middleware (Auth Token verification)

├── server.js               # Express entry point

└── package.json            # Backend dependencies

**🔌 API Endpoints Reference**

**Authentication**

  POST /api/user/register - Create a new user account
  
  POST /api/user/login - Authenticate a user and return a JWT
  
  User Data & Credits
  POST /api/user/credits - Fetch the current user's available credit balance
  
  Payments (Razorpay)
  POST /api/user/pay-razor - Generate a new Razorpay order ID based on the selected plan
  
  POST /api/user/verify-razor - Verify the Razorpay payment signature and add credits to the user's account

**Image Generation**

  POST /api/image/generate-image - Send a prompt to the Clipdrop API and return the base64 image data (deducts 1 credit)

A couple of tips before you commit this:
    Make sure to replace https://github.com/yourusername/imagify.git with your actual GitHub repo URL.
