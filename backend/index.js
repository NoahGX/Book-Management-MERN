import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, mongoDB_URL } from "./config.js";
import booksRoute from "./routes/booksRoute.js";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware for handling CORS Policy
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());
/* Option 2: Allow Custom Origins
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"]
    })
); */

app.get('/', (request, response) => {
    console.log(request);
    return response.status(200).send('Welcome to the Bookstore');
})

app.use('/books', booksRoute);

mongoose.connect(mongoDB_URL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to PORT: ${PORT}`);
        });
    }).catch((error) => {
    console.log(error);
});