import express from "express";
import path from "path";
import cors from "cors"; 
import axios from "axios"; 
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { checkConnection } from "./db.js"; // Ensure `db.js` is in the same directory

const app = express();
const PORT = 3002;

app.use(cors()); 

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the React build directory
//app.use(express.static(path.join(__dirname)));

axios.get('https://lovely-treacle-c111d4.netlify.app/')
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));


// Alternatively, redirect to Netlify URL
/*app.get('/', (req, res) => {
  res.redirect('https://lovely-treacle-c111d4.netlify.app/');
});*/ 

// Route for React app
/*app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname);
});*/

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Initialize Socket.IO
const io = new Server(server
  /* , {
  cors: {
    origin: 'https://lovely-treacle-c111d4.netlify.app',
    methods: ['GET', 'POST'],
  },
}  */ 
);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A client connected");

  // Listen for 'fetchRecords' event
  socket.on("fetchRecords", async () => {
    try {
      const { client, db, collection } = await checkConnection();
      //console.log('database connected');
      // Fetch records from the database
      const cursorPrachi = collection.find();
      const recordsPrachi = await cursorPrachi.toArray();

      // Merge the records
      const mergedRecords = [...recordsPrachi];
      
      //console.log(mergedRecords); 
      // Send the merged records back to the client
      socket.emit("recordsData", mergedRecords);
    } catch (err) {
      console.error("Error fetching records:");
      socket.emit("error", "An error occurred while fetching records.");
    } finally {
      // Uncomment if you want to close the client connection
      // await client.close();
    }
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
