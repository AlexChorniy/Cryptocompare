require('dotenv').config();
const {Worker} = require('worker_threads');
const {wait} = require("./helpers");

const main = async () => {
    const arguments = process.argv.slice(2);
    let data = [];
    let readWorker = new Worker('./workers/csv_reader_worker.js');

    readWorker.postMessage(process.env.DATA_FILE_PATH);

    const t0 = performance.now();

    readWorker.on('message', readData => {
        data = [...readData];
        if (data.length > 0) {
            const t1 = performance.now();
            console.log('performance', t1 - t0);
        }
    });

    await wait(() => data.length > 0);

    let calculateBalance = new Worker('./workers/calculate_balance_worker.js');
    calculateBalance.postMessage({arguments, data});
}

main();


