GreenCart Logistics - Delivery Simulation & KPI Dashboard
1. Project Overview & Purpose
GreenCart Logistics is an internal, full-stack web application designed for an eco-friendly delivery company. This tool empowers managers to simulate delivery operations by adjusting variables like available drivers and work hours. Based on these inputs and a set of proprietary company rules, the application calculates and displays key performance indicators (KPIs) such as overall profitability, delivery efficiency, and fuel costs. The goal is to provide actionable insights to optimize staffing, scheduling, and route allocation for improved operational performance.

The application features a secure login system, a dynamic dashboard with data visualizations, a simulation control panel, and full CRUD (Create, Read, Update, Delete) interfaces for managing drivers, routes, and orders.

2. Tech Stack Used
Frontend: React (with Hooks and Context API)

Backend: Node.js with Express

Database: MongoDB (Cloud-hosted via MongoDB Atlas)

Authentication: JSON Web Tokens (JWT)

Charting Library: Recharts

API Client: Axios

3. Setup Instructions
Prerequisites
Node.js (v14 or higher)

npm or yarn

A MongoDB Atlas account (or a local MongoDB instance)

Installation
Clone the repository:

Bash

git clone https://github.com/abhinashgupta/PurpleMerit_Asse.git
cd https://github.com/abhinashgupta/PurpleMerit_Asse.git
Setup Backend:

Bash

cd backend
npm install
Create a .env file in the server directory and add the environment variables listed below.

Setup Frontend:

Bash

cd frontend
npm install
Running the Application
Run the Backend Server:

From the server directory:

Bash

npm start
The backend will be running on http://localhost:5000.

Run the Frontend Application:

From the client directory:

Bash

npm start
The frontend will open in your browser at http://localhost:3000.

4. Environment Variables
Create a .env file in the server directory and add the following variables. Do not commit this file to version control.

Code snippet

# MongoDB Connection String
# Replace with your own connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your_super_secret_key_for_jwt

5. API Documentation
The following are examples of requests and responses for key API endpoints. All protected routes require a Bearer token in the Authorization header.

User Login
Endpoint: POST /api/auth/login

Description: Authenticates a user and returns a JWT.

Request Body:

JSON

{
    "username": "manager1",
    "password": "password123"
}
Success Response (200 OK):

JSON

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoi..."
}

Run Simulation
Endpoint: POST /api/simulation/run

Description: Runs a new simulation and returns the calculated KPIs.

Authentication: Required.

Request Body:

JSON

{
    "num_drivers": 8,
    "max_hours_per_driver": 10
}
Success Response (200 OK):

JSON

{
    "total_profit": "54321.00",
    "efficiency_score": "92.00",
    "on_time_deliveries": 46,
    "late_deliveries": 4,
    "fuel_cost": "4550.00",
    "fuel_cost_breakdown": {
        "base": 4200,
        "surcharge": 350
    }
}

6. Deployment Instructions

Backend (Render - Web Service)
Push your code to a GitHub repository.

On the Render Dashboard, click New + and select Web Service.

Connect your GitHub repository.

In the settings, ensure Render detects the server directory as the root. If not, set the Root Directory to server.

Set the Build Command to npm install.

Set the Start Command to npm start.

Go to the "Environment" tab and add your MONGODB_URI and JWT_SECRET environment variables.

Click Create Web Service. Render will deploy your API and provide you with a public URL (e.g., https://your-api-name.onrender.com).



Frontend (Render - Static Site)
Push your code to the same GitHub repository.

On the Render Dashboard, click New + and select Static Site.

Connect the same GitHub repository.

In the settings, set the Root Directory to frontend.

Set the Build Command to npm install && npm run build.

Set the Publish Directory to build.

Click Create Static Site.

Important: After your backend is deployed, copy its public URL. You must update the baseURL in client/src/services/api.js to point to this deployed backend URL and then redeploy your frontend for the change to take effect.