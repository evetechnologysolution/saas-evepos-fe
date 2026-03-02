export const generateRandomOrderId = (randomLength = 5) => {
  const now = new Date();

  const currYear = now.getFullYear().toString().slice(-2);
  const currMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currDate = String(now.getDate()).padStart(2, '0');

  const max = 10 ** randomLength;

  const random = Math.floor(Math.random() * max)
    .toString()
    .padStart(randomLength, '0');

  return `OR${currYear}${currMonth}${currDate}${random}`;
};
