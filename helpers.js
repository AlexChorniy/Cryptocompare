// const {getExchangeRate} = require("./api");
const compareDates = (dateFromArgument, timestampDate) => {
    return new Date(`${dateFromArgument}`).toLocaleDateString() === new Date(+timestampDate).toLocaleDateString();
}

const isDeposit = (type) => type === 'DEPOSIT';
const isWithdrawal = (type) => type === 'WITHDRAWAL';

const tokenExchangeRate = {
    BTC: 8671.1,
    ETH: 181.66,
    XRP: 0.2988,
};

const setIncrement = (acc, value, token, timestamp) => {
    // const rate = await getExchangeRate(token, 'USD', timestamp);
    //
    // const result = +acc + +value * rate;
    // console.log('setIncrement');
    return acc + +value * tokenExchangeRate[token];
}
const setDecrement = (acc, value, token) => {
    return acc - +value * tokenExchangeRate[token];
}

module.exports = {
    compareDates,
    isDeposit,
    isWithdrawal,
    setDecrement,
    setIncrement
};
