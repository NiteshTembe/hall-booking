import express from "express";
import { getAllCustomersBookings,getCustomerByName } from "../helper.js";
const router = express.Router();


//Get all Customers Booking data
router.get("/", async (req,res) => {
  const result = await getAllCustomersBookings();
  res.send(result);
});

//Get Booking data for particular customer
router.get("/:name", async (req,res) => {
  const { name } = req.params;
  const result = await getCustomerByName(name);
  res.send(result);
});


export const customersRouter = router;
