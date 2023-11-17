import { env } from '@/config/env.config';

export default function devConsole(...args: unknown[]) {
  if (env.NODE_ENV !== 'production') {
    console.log(args.join(' '));
  }
}
