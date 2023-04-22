
import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { roomsRouter } from "./routes/rooms.js";
import { customersRouter } from "./routes/cutomers.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

//console.log(process.env.MONGO_URL);
const MONGO_URL = process.env.MONGO_URL;

//Mongo connection
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is Connected");
  return client;
}

export const client = await createConnection();

//interceptor |  converting body to json
app.use(express.json());

//REST API Endpoints
app.get("/", (req, res) => {
  res.send("Welcome to Hall Booking API <br/> Please Read <a href='https://documenter.getpostman.com/view/26861485/2s93Xzw296'>https://documenter.getpostman.com/view/26861485/2s93Xzw296</a> documentation");
});
// routes for /rooms
app.use("/rooms", roomsRouter);
// routes for customers
app.use("/customers", customersRouter);


app.listen(PORT, () => console.log("Server started on the port", PORT));
