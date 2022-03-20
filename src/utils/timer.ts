export function timer() {
  return () => {
    const start = process.hrtime.bigint();
    return () => {
      const diff = process.hrtime.bigint() - start;
      const nanoseconds = diff;
      const number = Number(nanoseconds);
      const milliseconds = number / 1000000;
      const seconds = number / 1000000000;

      return {
        seconds,
        milliseconds,
        nanoseconds,
      };
    };
  };
}
