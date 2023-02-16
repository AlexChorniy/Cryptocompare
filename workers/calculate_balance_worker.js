const {parentPort} = require('worker_threads');
const {compareDates, isDeposit, isWithdrawal, setIncrement, setDecrement} = require("../helpers");

parentPort.on('message', async ({arguments, data}) => {
    switch (arguments.length) {
        case 0:
            const balance = data.reduce((acc, currentValue) => {
                const {timestamp, transaction_type, token, amount} = currentValue;

                if (isDeposit(transaction_type)) {
                    return setIncrement(acc, amount, token, timestamp);
                } else if (isWithdrawal(transaction_type)) {
                    return setDecrement(acc, amount, token, timestamp);
                }

                return acc;
            }, 0)

            console.log('Arguments amount: 0, your balance is', balance);
            break;
        case 1:
            const balance2 = data.reduce((acc, currentValue) => {
                const {timestamp, transaction_type, token, amount} = currentValue;
                const isToken = [...arguments[0]].length === 3;

                if (
                    isDeposit(transaction_type)
                    && isToken
                    && arguments[0] === token
                ) {
                    return setIncrement(acc, amount, token, timestamp);
                } else if (
                    isWithdrawal(transaction_type)
                    && isToken
                    && arguments[0] === token
                ) {
                    return setDecrement(acc, amount, token, timestamp);
                } else if (
                    isDeposit(transaction_type)
                    && !isToken
                    && compareDates(arguments, timestamp)) {
                    return setIncrement(acc, amount, token, timestamp);
                } else if (
                    isWithdrawal(transaction_type)
                    && !isToken
                    && compareDates(arguments, timestamp)
                ) {
                    return setDecrement(acc, amount, token, timestamp);
                }
                
                return acc;
            }, 0)

            console.log(`'Arguments amount: 1. Argument: ${arguments[0]}`, balance2);
            break;
        case 2:
            const currentToken = arguments.filter(arg => [...`${arg}`].length === 3)[0];
            const currentDate = arguments.filter(arg => [...`${arg}`].length !== 3)[0];

            const balance3 = data.reduce((acc, currentValue) => {
                const {timestamp, transaction_type, token, amount} = currentValue;

                if (
                    isDeposit(transaction_type)
                    && currentToken === token
                    && compareDates(currentDate, timestamp)
                ) {
                    return setIncrement(acc, amount, token, timestamp);
                } else if (
                    isWithdrawal(transaction_type)
                    && currentToken === token
                    && compareDates(currentDate, timestamp)
                ) {
                    return setDecrement(acc, amount, token, timestamp);
                }

                return acc;
            }, 0);

            console.log(`Arguments: ${currentToken}, ${currentDate}, your balance is`, balance3);
            break;
        default:
            console.log('ERROR: it\'s out of the question\'s task');
    }
})
