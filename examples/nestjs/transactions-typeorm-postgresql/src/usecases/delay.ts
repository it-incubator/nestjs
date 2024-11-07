export const delay: (ms: number) => Promise<unknown> = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

export const getUniqId = () => {
  return getUniqId._id++;
};
getUniqId._id = 10000;
