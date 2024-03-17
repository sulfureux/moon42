export const resolverError = (key: string, type: string, message: string) => {
  return {
    [key]: { type, message },
  };
};
