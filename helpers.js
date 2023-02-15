const axios = require("axios");
const compareDates = (dateFromArgument, timestampDate) => {
    return new Date(`${dateFromArgument}`).toLocaleDateString() === new Date(+timestampDate).toLocaleDateString();
}

const isDeposit = (type) => type === 'DEPOSIT';
const isWithdrawal = (type) => type === 'WITHDRAWAL';

const getDifferenceInDays = (t1, t2) => {
    return Math.ceil((t1 - t2) / (1000 * 3600 * 24)) || 1;
}

const getExchangeRate = async (from, to, date) => {
    const response = await axios
        .get(`${process.env.CRYPTO_COMPARE_URI}?fsym=${from}&tsyms=${to}&ts=${date}&api_key=${process.env.CRYPTO_API_KEY}`);
    return response.data[from][to];
};
// const exchangeRate = await getExchangeRate('BTC', 'USD', 1571965722);

const tokenExchangeRate = {
    BTC: 8671.1,
    ETH: 181.66,
    XRP: 0.2988,
};

const setIncrement = (acc, value, token) => {
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
