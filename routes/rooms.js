import express from "express";
import { addBooking, addRoom, checkRoomBooked, checkRoomID, getAllBookedRooms } from "../helper.js";
const router = express.Router();

//Create New Room
router.post("/", async (req, res) => {
  const createRoom = req.body;
  console.log(req.body);
  const isRoomExist = await checkRoomID(createRoom.room_id);
  if(isRoomExist){
    res.status(400).send({message : "Please change Room ID"})
    return;
  }
  const result = await addRoom(createRoom);
  res.send(result);
});

//Book a room
router.post("/bookings", async (req, res) => {
  const bookingData = req.body;
  const isRoomExist = await checkRoomID(bookingData.room_id);
  if(!isRoomExist){
    res.status(400).send({message : "Room ID Invalid"})
    return;
  }
  const isAlreadyBooked = await checkRoomBooked(bookingData);
  if(isAlreadyBooked){
    res.status(400).send({message : "Room is already booked for same time slot"})
    return;
  }
   const result = await addBooking(bookingData);
   if(result.acknowledged){
    res.send({message : `Room is booked with Booking ID : ${result.insertedId}`});
    return;
   }
   res.status(400).send({message : `Something Went Wrong - Please try again after some time`});
});

//Get all Rooms with booked data
router.get("/bookings", async (req, res) => {
  const result = await getAllBookedRooms();
  res.send(result);
});



export const roomsRouter = router;
