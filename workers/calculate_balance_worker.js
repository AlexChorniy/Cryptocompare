const {parentPort} = require('worker_threads');
const {
    compareDates,
    isDeposit,
    isWithdrawal,
    setIncrement,
    setDecrement,
    wait,
    getExchangeBalance,
} = require("../helpers");

parentPort.on('message', async ({arguments, data}) => {
    switch (arguments.length) {
        case 0:
            let balance = 0;
            let counter = 0;
            let asyncCounter = 0;

            for (const currentValue of data) {
                const {timestamp, transaction_type, token, amount} = currentValue;

                if (isDeposit(transaction_type) && token && timestamp) {
                    counter++;
                    await getExchangeBalance({
                        token,
                        timestamp,
                        setBalance: (rate) => {
                            balance = setIncrement(balance, amount, rate);
                            asyncCounter++;
                        }
                    })
                } else if (isWithdrawal(transaction_type) && token && timestamp) {
                    counter++;
                    await getExchangeBalance({
                        token,
                        timestamp,
                        setBalance: (rate) => {
                            balance = setDecrement(balance, amount, rate);
                            asyncCounter++;
                        }
                    })
                }
            }

            await wait(() => asyncCounter === counter);

            parentPort.postMessage(balance);
            break;
        case 1:
            let balanceOne = 0;
            let counterOne = 0;
            let asyncCounterOne = 0;

            for (const currentValue of data) {
                const {timestamp, transaction_type, token, amount} = currentValue;
                const isToken = [...arguments[0]].length === 3;

                if (isDeposit(transaction_type) && arguments[0] === token && timestamp) {
                    counterOne++;
                    await getExchangeBalance({
                        token,
                        timestamp,
                        setBalance: (rate) => {
                            balanceOne = setIncrement(balanceOne, amount, rate);
                            asyncCounterOne++;
                        }
                    })
                } else if (isWithdrawal(transaction_type) && arguments[0] === token && timestamp) {
                    counterOne++;
                    await getExchangeBalance({
                        token,
                        timestamp,
                        setBalance: (rate) => {
                            balanceOne = setDecrement(balanceOne, amount, rate);
                            asyncCounterOne++;
                        }
                    })
                } else if (isDeposit(transaction_type) && !isToken && compareDates(arguments, timestamp) && token && timestamp) {
                    counterOne++;
                    await getExchangeBalance({
                        token,
                        timestamp,
                        setBalance: (rate) => {
                            balanceOne = setIncrement(balanceOne, amount, rate);
                            asyncCounterOne++;
                        }
                    })
                } else if (isWithdrawal(transaction_type) && !isToken && compareDates(arguments, timestamp) && token && timestamp) {
                    counterOne++;
                    await getExchangeBalance({
                        token,
                        timestamp,
                        setBalance: (rate) => {
                            balanceOne = setDecrement(balanceOne, amount, rate);
                            asyncCounterOne++;
                        }
                    })
                }
            }

            await wait(() => counterOne === asyncCounterOne);

            parentPort.postMessage(balanceOne);
            break;
        case 2:
            const currentToken = arguments.filter(arg => [...`${arg}`].length === 3)[0];
            const currentDate = arguments.filter(arg => [...`${arg}`].length !== 3)[0];
            let balanceTwo = 0;
            let counterTwo = 0;
            let asyncCounterTwo = 0;

            for (const currentValue of data) {
                const {timestamp, transaction_type, token, amount} = currentValue;
                if (isDeposit(transaction_type) && currentToken === token && compareDates(currentDate, timestamp) && token && timestamp) {
                    counterTwo++
                    await getExchangeBalance({
                        token,
                        timestamp,
                        setBalance: (rate) => {
                            balanceTwo = setIncrement(balanceTwo, amount, rate);
                            asyncCounterTwo++;
                        }
                    })
                } else if (isWithdrawal(transaction_type) && currentToken === token && compareDates(currentDate, timestamp) && token && timestamp) {
                    counterTwo++
                    await getExchangeBalance({
                        token,
                        timestamp,
                        setBalance: (rate) => {
                            balanceTwo = setDecrement(balanceTwo, amount, rate);
                            asyncCounterTwo++;
                        }
                    })
                }
            }

            await wait(() => counterTwo === asyncCounterTwo);

            parentPort.postMessage(balanceTwo);
            break;
        default:
            console.log('ERROR: it\'s out of the question\'s task');
    }

})
