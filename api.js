const axios = require("axios");

const workWithAPI = {
    getExchangeRate(from, to, date) {
        // We need Promise here because cryptocompare has limit of free calls
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios
                    .get(`${process.env.CRYPTO_COMPARE_URI}?fsym=${from}&tsyms=${to}&ts=${date}&api_key=${process.env.CRYPTO_API_KEY}`);
                resolve(response.data[from][to]);
            } catch (e) {
                reject(e);
            }
        })
    },
    exchangeRateRequest({from, to, date, setBalance}) {
        const exchangeRate = workWithAPI.getExchangeRate(from, to, date);
        exchangeRate
            .then((rate) => {
                console.log('exchangeRateRequest', rate);
                setBalance(rate);
            })
            .catch((error) => console.log('ERROR:isDeposit', error))
    },
}

module.exports = {
    workWithAPI,
}
