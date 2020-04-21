const { clientSigningSecret, botToken, mongoUrl } = require('config');
const { emoji } = require('node-emoji');

const { customEmoji } = require('./custom-emoji');
const { customChoices, customReplies } = require('./custom-convo');
const { customEntities } = require('./custom-entities');

/**
 * uri passed to `connect` method that opens the default mongoose connection.
 * @type {String}
 */
exports.mongoUrl = mongoUrl;

/**
 * SlackAdapter options
 * @type {Object}
 */
exports.adapterOpts = { clientSigningSecret, botToken };

/**
 * The word to tell the classify script to pass
 * @type {String}
 */
exports.skipWord = 'Skip';

/**
 * Defined intents that are used as Inquirer.js `choices`
 * @type {Array}
 */
exports.choices = [...customChoices, 'None', exports.skipWord];

/**
 * Nested arrays for entity identification
 * @type {Array}
 */
exports.namedEntities = [
  ...customEntities,

  // add emoji for entity extraction
  ...Object.keys(emoji).reduce(
    (acc, curr) => [...acc, ['emoji', curr, ['en'], [`:${curr}:`]]],
    [],
  ),
  // add custom emoji's for entity extraction
  ...customEmoji.map(ce => ['emoji', ce, ['en'], [`:${ce}:`]]),
];

/**
 * Supported message types
 * @type {Array}
 */
exports.replyMessageTypes = ['direct_message', 'direct_mention', 'mention'];

/**
 * Defined bot replies
 * @type {Array}
 */
exports.replies = [...customReplies];

/**
 * Mongoose options
 * @type {Object}
 */
exports.mongooseOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
