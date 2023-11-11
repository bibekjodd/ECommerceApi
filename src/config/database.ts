import mongoose from 'mongoose';
import devConsole from '../lib/devConsole';
import { env } from './env.config';

export default async function connectDatabase() {
  try {
    const { connection } = await mongoose.connect(env.MONGO_URI);
    devConsole(`Mongodb connected to ${connection.host}`.magenta);
  } catch (err) {
    devConsole(`Error occurred while connecting mongodb`.red);
  }
}
