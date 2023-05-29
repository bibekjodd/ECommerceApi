import mongoose from "mongoose";

global.databaseConnected = false;
export default async function connectDatabase() {
  

  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb connected to ${connection.host}`.magenta);
    global.databaseConnected = true;
  } catch (err) {
    console.log(`Error occurred while connecting mongodb`.red);
    global.databaseConnected = false;
  }
}
