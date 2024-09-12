import dotenv from 'dotenv';
dotenv.config()

export const PORT = 3000;
export const mongoDB_URL = process.env.MONGODB_URL