import express from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import { mongoDBURL } from "../.env";
import { Book } from "./models/bookModel.js";

const app = express();

app.get('/', (request, response) => {
    console.log(request);
    return response.status(200).send('Welcome');
})

app.post('/books', async (request, response) => {
    try {
        if (
            !request.body.title || 
            !request.body.author || 
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields...'
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear
        };
        const book = await Book.create(newBook);
        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to PORT: ${PORT}`);
        });
    }).catch((error) => {
    console.log(error);
});