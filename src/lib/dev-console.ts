import { env } from '@/config/env.config';

export default function devConsole(...args: unknown[]) {
  if (env.NODE_ENV === 'development') {
    console.log(...args);
  }
}
