import { devConsole } from '@/lib/utils';
import { connect } from 'mongoose';
import { env } from './env.config';
import {} from 'mongoose';
import MongoStore from 'connect-mongo';

export const connectDatabase = async (): Promise<MongoStore['clientP']> => {
  return connect(env.MONGO_URI)
    .then(({ connection }) => {
      devConsole(`⚡[Mongodb]: connected to ${connection.host}`.magenta);
      return connection.getClient();
    })
    .catch((err) => {
      if (err instanceof Error) console.log(err.message.red);
      console.log(`Error occurred while connecting mongodb\n Exitting app...`.red);
      process.exit(1);
    });
};
