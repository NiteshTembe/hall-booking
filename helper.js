import { client } from "./index.js";

//--------------------MongoDB queries for Room----------------
// to create new Room
export async function addRoom(newRoom) {
    return await client.db("hall-booking").collection("rooms").insertOne(newRoom);   
}

// check if same room id exist in database
export async function checkRoomID(room_id) {
    return await client.db("hall-booking").collection("rooms").findOne({ room_id : room_id})
}

// check if room is booked for same time slot on that date
export async function checkRoomBooked({room_id,start_time,end_time}) {
    return await client.db("hall-booking").collection("bookings").findOne({ $and : [
        { room_id : room_id},
        { $or : [
            { $and : [
                { start_time : { $gte : new Date(start_time)}},
                { start_time : { $lt : new Date(end_time) }},
            ]},
            { $and : [
                { end_time : { $gt : new Date(start_time)}},
                { end_time : { $lte : new Date(end_time) }},
            ]}
        ]}
     ]});
}
// to book room(hall)
export async function addBooking({room_id,start_time,end_time,customer_name,booking_date,booking_status}) {
    return await client.db("hall-booking").collection("bookings").insertOne({
        room_id: room_id,
        customer_name: customer_name,
        booking_date : new Date(booking_date),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        booking_status: booking_status
    });
}

// Get All rooms with booking details
export async function getAllBookedRooms() {
    return await client.db("hall-booking").collection("bookings").aggregate( [
        {
           $lookup: {
              from: "rooms",
              localField: "room_id",    // field in the orders collection
              foreignField: "room_id",  // field in the items collection
              as: "fromItems"
           }
        },
        {
           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
        },
        {
            $project: {
                booking_date: { $dateToString: { format: "%Y-%m-%d", date: "$booking_date" } },
                customer_name: 1,
                start_time: { $dateToString: { format: "%H:%M:%S", date: "$start_time" } },
                end_time: { $dateToString: { format: "%H:%M:%S", date: "$end_time" } },
                _id: 0,
                booking_status:1,
                room_name : 1
            }
        }
     ] ).toArray();
}

// Get All customers with booking details
export async function getAllCustomersBookings() {
    return await client.db("hall-booking").collection("bookings").aggregate( [
        {
           $lookup: {
              from: "rooms",
              localField: "room_id",    // field in the orders collection
              foreignField: "room_id",  // field in the items collection
              as: "fromItems"
           }
        },
        {
           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
        },
        {
            $project: {
                booking_date: { $dateToString: { format: "%Y-%m-%d", date: "$booking_date" } },
                customer_name: 1,
                start_time: { $dateToString: { format: "%H:%M:%S", date: "$start_time" } },
                end_time: { $dateToString: { format: "%H:%M:%S", date: "$end_time" } },
                _id: 0,
                room_name : 1
            }
        }
     ] ).toArray();
}

// Get customers booking by Name
export async function getCustomerByName(customer_name) {
    return await client.db("hall-booking").collection("bookings").aggregate( [
        {
            $match: { customer_name: customer_name }
         },
        {
           $lookup: {
              from: "rooms",
              localField: "room_id",    // field in the orders collection
              foreignField: "room_id",  // field in the items collection
              as: "fromItems"
           }
        },
        {
           $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
        },
        {
            $project: {
                booking_date: { $dateToString: { format: "%Y-%m-%d", date: "$booking_date" } },
                customer_name: 1,
                start_time: { $dateToString: { format: "%H:%M:%S", date: "$start_time" } },
                end_time: { $dateToString: { format: "%H:%M:%S", date: "$end_time" } },
                _id: 0,
                booking_status: 1,
                booking_id: "$_id",
                room_name : 1
            }
        }
     ] ).toArray();
}


export async function bookRoom(bookingData) {
    return await client.db("hall-booking").collection("rooms").insertOne(bookingData);   
}
