export const getConfig = () => {
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  return {
    username,
    password,
  };
};
