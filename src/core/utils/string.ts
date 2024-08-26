/**
 * Generate random string
 * @return {string}
 */
export const createRandomString = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
