const mongoose = require('mongoose');

const { Botkit } = require('botkit');
const {
  SlackAdapter,
  SlackMessageTypeMiddleware,
} = require('botbuilder-adapter-slack');

const {
  replyMessageTypes,
  replies,
  mongoUrl,
  mongooseOpts,
  adapterOpts,
} = require('./lib/constants');
const { randItem, flipCoin } = require('./lib/helpers');
const { SlackMessageSchema, IntentionSchema } = require('./lib/schemas');

const adapter = new SlackAdapter(adapterOpts).use(
  new SlackMessageTypeMiddleware(),
);

const SlackMessageModel = mongoose.model('SlackMessage', SlackMessageSchema);

function saveMessage({ incoming_message: message }) {
  return new SlackMessageModel(message).save();
}

(async () => {
  await mongoose.connect(mongoUrl, mongooseOpts);

  const controller = new Botkit({ adapter });

  controller.hears('.*', 'message', (bot, message) => saveMessage(message));

  controller.on(replyMessageTypes, async (bot, message) => {
    const reply = randItem(replies);

    await bot.reply(message, flipCoin() ? reply.toUpperCase() : reply);
    await saveMessage(message);
  });
})();
