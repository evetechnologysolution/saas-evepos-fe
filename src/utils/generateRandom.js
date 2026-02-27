export const generateRandomId = (limitChar = 10) => {
  const randomNum = Math.floor(Math.random() * 1000000) + Math.floor(performance.now());

  // Mengubah angka menjadi string dan mengambil limit karakter pertama
  const id = randomNum.toString().slice(0, limitChar);

  const currYear = new Date().getFullYear().toString().slice(-2); // 2 digit tahun
  const currMonth = String(new Date().getMonth() + 1).padStart(2, '0'); // 2 digit bulan
  const currDate = String(new Date().getDate()).padStart(2, '0'); // 2 digit tanggal

  return `OR${currYear}${currMonth}${currDate}${id}`;
};
