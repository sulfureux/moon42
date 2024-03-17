export const sleep = async (timeMs: number): Promise<null> =>
  new Promise((resolve) => {
    setTimeout(resolve, timeMs);
  });
