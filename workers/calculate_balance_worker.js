const {parentPort} = require('worker_threads');
const {compareDates, isDeposit, isWithdrawal, setIncrement, setDecrement, wait} = require("../helpers");
const {workWithAPI} = require("../api");

parentPort.on('message', async ({arguments, data}) => {
    switch (arguments.length) {
        case 0:
            let balance = 0;
            let counter = 0;

            data.forEach((currentValue) => {
                const {timestamp, transaction_type, token, amount} = currentValue;
                if (isDeposit(transaction_type) && token && timestamp) {
                    const exchangeRate = workWithAPI.getExchangeRate(token, 'USD', timestamp);
                    exchangeRate
                        .then((rate) => {
                            balance = setIncrement(balance, amount, rate);
                            counter++;
                        })
                        .catch((error) => console.log('ERROR:isDeposit', error))
                } else if (isWithdrawal(transaction_type) && token && timestamp) {
                    const exchangeRate = workWithAPI.getExchangeRate(token, 'USD', timestamp);
                    exchangeRate
                        .then((rate) => {
                            balance = setDecrement(balance, amount, rate);
                            counter++;
                        })
                        .catch((error) => console.log('ERROR:isWithdrawal', error))
                }
            })

            await wait(() => counter === data.length);

            console.log('Arguments amount: 0, your balance is', balance);
            break;
        case 1:
            let balanceOne = 0;
            let counterOne = 0;
            let asyncCounterOne = 0;

            data.forEach((currentValue, index) => {
                const {timestamp, transaction_type, token, amount} = currentValue;
                const isToken = [...arguments[0]].length === 3;

                if (isDeposit(transaction_type) && arguments[0] === token && timestamp) {
                    counterOne++
                    const exchangeRate = workWithAPI.getExchangeRate(token, 'USD', timestamp);
                    exchangeRate
                        .then((rate) => {
                            balanceOne = setIncrement(balanceOne, amount, rate);
                            asyncCounterOne++;
                        })
                        .catch((error) => console.log('ERROR:isDeposit', error))
                } else if (isWithdrawal(transaction_type) && arguments[0] === token && timestamp) {
                    counterOne++
                    const exchangeRate = workWithAPI.getExchangeRate(token, 'USD', timestamp);
                    exchangeRate
                        .then((rate) => {
                            balanceOne = setDecrement(balanceOne, amount, rate);
                            asyncCounterOne++;
                        })
                        .catch((error) => console.log('ERROR:isDeposit', error))
                } else if (isDeposit(transaction_type) && !isToken && compareDates(arguments, timestamp) && token && timestamp) {
                    counterOne++
                    const exchangeRate = workWithAPI.getExchangeRate(token, 'USD', timestamp);
                    exchangeRate
                        .then((rate) => {
                            balanceOne = setIncrement(balanceOne, amount, rate);
                            asyncCounterOne++;
                        })
                        .catch((error) => console.log('ERROR:isDeposit', error))
                } else if (isWithdrawal(transaction_type) && !isToken && compareDates(arguments, timestamp) && token && timestamp) {
                    counterOne++
                    const exchangeRate = workWithAPI.getExchangeRate(token, 'USD', timestamp);
                    exchangeRate
                        .then((rate) => {
                            balanceOne = setDecrement(balanceOne, amount, rate);
                            asyncCounterOne++;
                        })
                        .catch((error) => console.log('ERROR:isDeposit', error))
                }
            })

            await wait(() => counterOne === asyncCounterOne);

            console.log(`'Arguments amount: 1. Argument: ${arguments[0]}`, balanceOne);
            break;
        case 2:
            const currentToken = arguments.filter(arg => [...`${arg}`].length === 3)[0];
            const currentDate = arguments.filter(arg => [...`${arg}`].length !== 3)[0];
            let balanceTwo = 0;
            let counterTwo = 0;
            let asyncCounterTwo = 0;

            data.forEach((currentValue) => {
                const {timestamp, transaction_type, token, amount} = currentValue;
                if (isDeposit(transaction_type) && currentToken === token && compareDates(currentDate, timestamp) && token && timestamp) {
                    counterTwo++
                    const exchangeRate = workWithAPI.getExchangeRate(token, 'USD', timestamp);
                    exchangeRate
                        .then((rate) => {
                            balanceTwo = setIncrement(balanceTwo, amount, rate);
                            asyncCounterTwo++;
                        })
                        .catch((error) => console.log('ERROR:isDeposit', error))
                } else if (isWithdrawal(transaction_type) && currentToken === token && compareDates(currentDate, timestamp) && token && timestamp) {
                    counterTwo++
                    const exchangeRate = workWithAPI.getExchangeRate(token, 'USD', timestamp);
                    exchangeRate
                        .then((rate) => {
                            balanceTwo = setDecrement(balanceTwo, amount, rate);
                            asyncCounterTwo++;
                        })
                        .catch((error) => console.log('ERROR:isDeposit', error))
                }
            })

            await wait(() => counterTwo === asyncCounterTwo);

            console.log(`Arguments: ${currentToken}, ${currentDate}, your balance is`, balanceTwo);
            break;
        default:
            console.log('ERROR: it\'s out of the question\'s task');
    }
})
