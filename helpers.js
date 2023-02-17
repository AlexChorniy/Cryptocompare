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

let state;

const synchronize = (cb) => {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (state !== cb()) {
                clearInterval(interval);
                state = cb();
                resolve();
            }
        }, 100);
    })
}

const getRoundDate = (timestamp) => {
    return new Date(+timestamp).setHours(0, 0, 0, 0);
}

module.exports = {
    compareDates,
    isDeposit,
    isWithdrawal,
    setDecrement,
    setIncrement,
    synchronize,
    wait,
    getRoundDate,
};
