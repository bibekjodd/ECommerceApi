import devConsole from '@/lib/dev-console';
import { connect } from 'mongoose';
import { env } from './env.config';

export default async function connectDatabase() {
  try {
    const { connection } = await connect(env.MONGO_URI);
    devConsole(`⚡[Mongodb]: connected to ${connection.host}`.magenta);
  } catch (err) {
    devConsole(`Error occurred while connecting mongodb`.red);
  }
}
