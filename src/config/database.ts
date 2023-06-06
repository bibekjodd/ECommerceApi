import mongoose from "mongoose";
import devConsole from "../lib/devConsole";

global.databaseConnected = false;
export default async function connectDatabase() {
  

  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    devConsole(`Mongodb connected to ${connection.host}`.magenta);
    global.databaseConnected = true;
  } catch (err) {
    devConsole(`Error occurred while connecting mongodb`.red);
    global.databaseConnected = false;
  }
}
