import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const url =  process.env.DB_URL || "mongodb://localhost:27017/"; 

async function checkConnection() {
    try {
const client = new MongoClient(url);
const db = await client.db("Vercel");
const collection = db.collection("projects");  

return {client,db,collection}; 
    }
    catch(err) {
        console.log("error");
        return false; 
    }
};

export { checkConnection };

