require('dotenv').config();
const {Worker} = require('node:worker_threads');
const {wait} = require("./helpers");
const fs = require("fs");
const cpuAmount = require('node:os').cpus().length;


const main = async () => {
    const getArguments = process.argv.slice(2);
    let _queue = [];
    const batchSize = 10_000;
    const stats = fs.statSync(process.env.DATA_FILE_PATH);

    let readWorker = new Worker('./workers/csv_reader_worker.js');
    console.log('CPU amount', cpuAmount);

    const t0 = performance.now();

    readWorker.postMessage(process.env.DATA_FILE_PATH);

    readWorker.on('message', readData => {
        const numBatches = Math.ceil(readData.length / batchSize);
        Array(numBatches).fill().forEach((_, index) => {
            const start = index * batchSize;
            const end = Math.min(start + batchSize, stats.size);
            _queue.push(readData.filter((_, index) => index >= start && index < end));
        });

        if (_queue.length > 0) {
            const t1 = performance.now();
            console.log('performance', t1 - t0, numBatches);
        }
    });

    await wait(() => _queue.length > 0);

    Promise.all(
        Array(cpuAmount).fill().map(() => {
            return new Promise((resolve, reject) => {
                try {
                    let calculateBalance = new Worker('./workers/calculate_balance_worker.js');
                    calculateBalance.postMessage({arguments: getArguments, data: _queue.shift()});
                    calculateBalance.on('message', (balance) => {
                        resolve(balance);
                    })
                    calculateBalance.on('exit', () => {
                        if (_queue.length > 0) {
                            calculateBalance.postMessage({arguments: getArguments, data: _queue.shift()});
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            })
        })
    ).then((workers) => {
        const balance = workers.reduce((acc, currentValue) => acc + currentValue, 0);
        console.log('your balance is', balance);
    })
}

main();


