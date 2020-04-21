const { filter } = require('fuzzy');

const { choices } = require('./constants');

exports.randItem = items => items[Math.floor(Math.random() * items.length)];

exports.flipCoin = () => Math.round(Math.random()) % 2 == 0;

exports.source = (answers, input = '') =>
  new Promise(resolve =>
    resolve(filter(input, choices).map(({ original }) => original)),
  );
