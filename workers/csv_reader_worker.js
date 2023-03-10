const csv = require("csv-parser");
const fs = require('fs');
const {parentPort} = require('worker_threads');

parentPort.on('message', filePath => {
    const transactions = [];
    const result = new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .on('error', reject)
            .pipe(csv())
            .on('data', (data) => {
                if (Object.keys(data).length > 0) {
                    transactions.push(data);
                }
            })
            .on('end', () => {
                resolve(transactions);
            });
    });


    result
        .then(response => {
            parentPort.postMessage(response);
        })
        .catch(error => console.log('csv_reader_worker.js error', error));
})








