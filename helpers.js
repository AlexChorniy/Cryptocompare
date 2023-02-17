const {workWithAPI} = require("./api");
const compareDates = (dateFromArgument, timestampDate) => {
    return new Date(`${dateFromArgument}`).toLocaleDateString() === new Date(+timestampDate).toLocaleDateString();
}

const isDeposit = (type) => type === 'DEPOSIT';
const isWithdrawal = (type) => type === 'WITHDRAWAL';

const setIncrement = (acc, value, rate) => {
    return acc + +value * rate;
}
const setDecrement = (acc, value, rate) => {
    return acc - +value * rate;
}

const wait = (cb) => {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (cb()) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    })
}

const updateExchangeRateState = (
    {from, to, date, setBalance}
) => {
    const exchangeRate = workWithAPI.getExchangeRate(from, to, date);
    exchangeRate
        .then((rate) => {
            setBalance(rate);
        })
        .catch((error) => console.log('ERROR:isDeposit', error))
}

module.exports = {
    updateExchangeRateState,
    compareDates,
    isDeposit,
    isWithdrawal,
    setDecrement,
    setIncrement,
    wait,
};
