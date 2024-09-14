# Book Management System (MERN)

## Overview
This project is a simple Book Management System built using `Node.js` with `Express`, `MongoDB`, and `Mongoose` for the backend to manage a RESTful API and interact with the database, while using `React.js` for the frontend to communicate with this API using `Axios`. This simple application allows users to create, read, update, and delete (CRUD) books that are stored in a MongoDB database.

## Features
- **Create Book**: Users can add new books.
- **Edit Book**: Users can update any details of listed books.
- **View Book**: Users can view the details of any book stored in the database.
- **Delete Book**: Users can delete a book with system confirmation before proceeding.
- **Real-Time Notifications**: Uses **notistack** for showing success, error, or warning messages.
- **Loading States**: Displays a loading spinner when data is being fetched or saved.

## Usage
### Backend Setup:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/book-management-system.git
   ```

2. **Install backend dependencies**:
   Navigate to the backend directory and run:
   ```bash
   npm install
   ```

3. **Set up MongoDB database**:
   You need a MongoDB instance running locally or on a cloud provider (e.g., MongoDB Atlas).
   - If using MongoDB locally, ensure MongoDB is installed and running.
   - If using MongoDB Atlas, create a cluster and get the connection string.

4. **Set up environment variables**:
   - Create a `.env` file in the root of the backend project and add your MongoDB connection:
     ```
     mongoDB_URL=mongodb+srv://<db_username>:<db_password>@bookstore-mern.qycsf.mongodb.net/?retryWrites=true&w=majority&appName=Bookstore-MERN
     ```

5. **Start the backend server**:
   ```bash
   npm run dev
   ```
   The backend server will be running at `http://localhost:5000`.

### Frontend Setup:
1. **Install frontend dependencies**:
   Navigate to the frontend directory and run:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Create a `.env` file in the root of your frontend project and add:
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```
   This points the frontend to the backend API running on `http://localhost:5000`.

3. **Start the frontend application**:
   ```bash
   npm run dev
   ```
   The frontend will now be running at `http://localhost:3000`, and it will interact with the backend at `http://localhost:5000`.

## Prerequisites
- **Node.js**: Required to run both the frontend and backend.
- **MongoDB**: A MongoDB database is needed to store book data.
- **npm**: Node Package Manager to install and manage dependencies.
- **RESTful API**: The backend server exposes RESTful API endpoints for frontend interaction.

## Input
- **Create/Edit Book**:
  - **Title**: A required string representing the title of the book.
  - **Author**: A required string representing the author's name.
  - **Publish Year**: A required number representing the year the book was published.
- **Validation**:
  - All fields must be filled before submission.
  - The publish year must be a positive number.

## Output
- **Create/Edit Book**: After successfully creating or editing a book, a success message is shown, and the user is redirected to the homepage.
- **Delete Book**: A confirmation is required before deleting a book. If successful, a success message is displayed, and the user is redirected to the homepage.
- **View Book**: Displays book details including title, author, publish year, creation time, and last update time.

## Notes
- **API Endpoints**:
    - **POST** `/books`: Creates a new book.
    - **GET** `/books`: Retrieves all books.
    - **GET** `/books/:id`: Retrieves a single book by its `id`.
    - **PUT** `/books/:id`: Updates a book by its `id`.
    - **DELETE** `/books/:id`: Deletes a book by its `id`.
- **Error Handling**: All routes have proper error handling and return appropriate status codes (400, 404, 500) based on the error.
- **Schema Design**: The MongoDB database stores books with `title`, `author`, and `publishYear` fields, along with timestamps (`createdAt` and `updatedAt`) for auditing.
- **Cross-Origin Requests**: The backend is configured to allow cross-origin requests (CORS), enabling communication between the frontend (React) and backend (Express).