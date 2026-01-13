export const generateRandomId = (limitChar = 10) => {
    const randomNum = Math.floor(Math.random() * Date.now()) + Math.floor(Math.random() * 1000000);

    // Mengubah angka menjadi string dan mengambil limit karakter pertama
    const id = randomNum.toString().slice(0, limitChar);

    const currYear = new Date().getFullYear();

    return `ORD${currYear}${id}`;
}