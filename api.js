const axios = require("axios");

const getExchangeRate = async (from, to, date) => {
    let response;
    // We need Promise here because cryptocompare has limit of free calls
    await new Promise((resolve) => setTimeout(async () => {
        response = (await axios
            .get(`${process.env.CRYPTO_COMPARE_URI}?fsym=${from}&tsyms=${to}&ts=${date}&api_key=${process.env.CRYPTO_API_KEY}`)).data[from][to];
        resolve()
    }, 600));

    return response;
};

module.exports = {
    getExchangeRate
}
