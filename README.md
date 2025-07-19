# SmartQA

SmartQA is a real-time question and answer application designed to facilitate interactive sessions. It allows users to create and join virtual rooms, where participants can submit questions, and the room host can view, manage, and utilize AI-powered summarization to highlight top questions.

## Features

* **User Authentication:** Secure registration and login for users.
* **Room Management:**
    * Room creators (hosts) can generate unique room codes.
    * Participants can join rooms using the room code.
* **Real-time Q&A:**
    * Participants can post questions in real-time.
    * Questions are displayed instantly to all room members.
* **AI-Powered Summarization:** Room hosts can trigger an AI model (Gemini) to summarize and group similar questions into a concise list of top questions.
* **Question Management:** Hosts can delete questions from the room.

## Technologies Used

This project is built as a MERN (MongoDB, Express, React, Node.js) stack application with Socket.io for real-time communication and integration with the Google Gemini API for AI-driven question summarization.

### Frontend (Smartqa-react-client)

* **React 19:** For building the user interface.
* **Vite:** A fast build tool for modern web projects.
* **React Router DOM:** For navigation and routing within the application.
* **Redux Toolkit:** For state management.
* **Axios:** For making HTTP requests to the backend API.
* **Socket.io Client:** For real-time bidirectional communication with the server.
* **TailwindCSS:** A utility-first CSS framework for styling.

### Backend (Smartqa-server)

* **Node.js & Express:** For building the RESTful API.
* **MongoDB & Mongoose:** As the NoSQL database and ODM (Object Data Modeling) library for Node.js.
* **Socket.io:** For enabling real-time features like instant question display and summary updates.
* **JSON Web Token (JWT) & bcryptjs:** For secure user authentication and password hashing.
* **`dotenv`:** For managing environment variables.
* **CORS:** Middleware for enabling Cross-Origin Resource Sharing.
* **Google Gemini API:** Integrated for generating summaries of questions.

## Setup and Installation

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn (package manager)
* MongoDB (local installation or cloud-hosted service like MongoDB Atlas)
* Google Cloud Project with Gemini API enabled and an API Key

### Backend Setup (`Smartqa-server`)

1.  **Navigate to the server directory:**
    ```bash
    cd Smartqa-server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create a `.env` file:** In the `Smartqa-server` directory, create a file named `.env` and add the following environment variables:
    ```
    MONGODB_URL=<Your MongoDB Connection String>
    JWT_SECRET=<A strong, random secret key for JWT>
    CLIENT_URL=http://localhost:5173 # Or the URL where your React client will run
    GEMINI_API_KEY=<Your Google Gemini API Key>
    PORT=8080 # Or any port you prefer
    ```
    * **`MONGODB_URL`**: This is your MongoDB connection string. For MongoDB Atlas, you can find this in your cluster's connection settings. For a local instance, it might be `mongodb://localhost:27017/smartqa`.
    * **`JWT_SECRET`**: Generate a long, random string. You can use an online tool or a simple script to generate one.
    * **`GEMINI_API_KEY`**: Obtain this from your Google Cloud Project after enabling the Gemini API.
4.  **Start the backend server:**
    ```bash
    npm start
    # or
    node server.js
    ```
    The server should start on the specified `PORT` (default 8080).

### Frontend Setup (`Smartqa-react-client`)

1.  **Navigate to the client directory:**
    ```bash
    cd Smartqa-react-client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create a `.env` file:** In the `Smartqa-react-client` directory, create a file named `.env` and add the following environment variable:
    ```
    VITE_SERVER_ENDPOINT=http://localhost:8080 # Or the URL where your backend server is running
    ```
4.  **Start the frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The React application will usually open in your browser at `http://localhost:5173`.

## Usage

1.  **Register/Login:** Upon launching the application, register for a new account or log in if you already have one.
2.  **Create a Room (Host):** After logging in, select "Create Room" to generate a unique room code. You will automatically be the host of this room.
3.  **Join a Room (Participant):** Use the "Join Room" option and enter a valid room code provided by a host.
4.  **Ask Questions:** If you are a participant, you will see a text area to submit your questions. The questions will appear in real-time for everyone in the room.
5.  **Summarize Questions (Host):** As the host, a "Summarize Questions with AI" button will be visible. Clicking this will send all current questions to the Gemini API for summarization, and the generated top questions will be displayed.
6.  **Delete Questions (Host):** The host also has the ability to delete individual questions from the list.

