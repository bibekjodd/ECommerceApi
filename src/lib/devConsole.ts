export default function devConsole(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(args.join(" "));
  }
}
