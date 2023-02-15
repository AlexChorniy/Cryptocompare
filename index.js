require('dotenv').config();
const {Worker} = require('worker_threads');

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

    // sleep module, waiting until worker returns data
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (data.length > 0) {
                clearInterval(interval);
                resolve();
            }
        }, 1000);
    })

    let calculateBalance = new Worker('./workers/calculate_balance_worker.js');
    calculateBalance.postMessage({arguments, data});
}

main();


