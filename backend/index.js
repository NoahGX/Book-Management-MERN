import express from "express";
import mongoose from "mongoose";
import { PORT } from "./config.js";
import { mongoDBURL } from "../.env";

const app = express();

app.get('/', (request, response) => {
    console.log(request);
    return response.status(200).send('Welcome');
})

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to PORT: ${PORT}`);
        });
    }).catch((error) => {
    console.log(error);
});