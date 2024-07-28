import express from "express";
import { MongoClient, MongoServerError } from "mongodb"; // Imported MongoServerError
import { MONGODB_URL, PORT } from "./config.js";
import cors from "cors";

const app = express();

app.use(cors({
    allowedHeaders: ['Content-Type'] // Allow only Content-Type header
}));

app.use(express.json());

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});


const client = new MongoClient(MONGODB_URL);

// Removed unnecessary `db` variable
const collection = client.db("SurveyForm_freeCodeCamp").collection("forms"); // Fixed collection assignment

async function main() {
    await client.connect();
    console.log('Connected successfully to server');
}

main()
    .catch(console.error); // Removed unnecessary parts of promise chain

app.post('/', async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
        await collection.insertOne(data);
        res.status(200).send({message: "success"}); // Moved inside try block to ensure it's only sent if insert succeeds
    } catch (error) {
        if (error instanceof MongoServerError) {
            console.log(`Error worth logging: ${error}`); // special case for some reason
        }
        res.status(500).send('Error'); // Send error response
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
