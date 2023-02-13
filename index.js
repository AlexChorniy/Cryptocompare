require('dotenv').config();
// const axios = require("axios");
const {Worker} = require('worker_threads');

// const api = process.env.CRYPTO_API_KEY;

// const getExchangeRate = async (from, to, date) => {
//     const response = await axios
//         .get(`${process.env.CRYPTO_COMPARE_URI}
//             ?fsym=${from}
//             &tsyms=${to}
//             &ts=${date}
//             &api_key=${process.env.CRYPTO_API_KEY}`);
//     return response.data[from][to];
// };


const main = async () => {
    // const arguments = process.argv.slice(2);

    let worker = new Worker('./worker.js');
    worker.postMessage(process.env.DATA_FILE_PATH);
    worker.on('message', data => console.log('worker', data));

    // const transactions = await readTransactions(process.env.DATA_FILE_PATH);
    // const exchangeRate = await getExchangeRate('XRP', 'USD', 1571965722);

    // switch (arguments.length) {
    //     case 0:
    //         const latestDate = new Date().toISOString().split('T')[0];
    //         return latestDate;
    //     default:
    //         return 'qwerty';
    // }

    // console.log('main:', arguments);
}

main();


