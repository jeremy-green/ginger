const inquirer = require('inquirer');
const mongoose = require('mongoose');
const autocompletePrompt = require('inquirer-autocomplete-prompt');

const { NlpManager } = require('node-nlp');
const { mongoUrl } = require('config');
const {
  argv: { intent = [] },
} = require('yargs');

const {
  choices,
  namedEntities,
  mongooseOpts,
  skipWord,
} = require('./lib/constants');
const { source } = require('./lib/helpers');
const { SlackMessageSchema, IntentionSchema } = require('./lib/schemas');

const english = 'en';
const log = false;
const manager = new NlpManager({ languages: [english], nlu: { log } });

const IntentionModel = mongoose.model('Intention', IntentionSchema);
const SlackMessageModel = mongoose.model('SlackMessage', SlackMessageSchema);

(async () => {
  await mongoose.connect(mongoUrl, mongooseOpts);

  const messages = await SlackMessageModel.find();

  inquirer.registerPrompt('autocomplete', autocompletePrompt);

  try {
    manager.load();
  } catch {
    // `model.nlp` doesn't exist, create it
  }

  // messages.forEach(m => console.log(m));

  const questions = messages.map(({ text, _id: name }) => ({
    type: 'autocomplete',
    message: text.trim(),
    source,
    choices,
    name,
  }));

  namedEntities.forEach(entity => manager.addNamedEntityText(...entity));

  for (let question of questions) {
    const { message, name: _origin } = question;

    const [isClassified] = await IntentionModel.find({ _origin });

    if (
      isClassified &&
      // allow for reclassification through CLI flags (--intent None)
      !intent.includes(isClassified.intent)
    ) {
      continue;
    }

    const answer = await inquirer.prompt({ ...question });
    const [formattedAnswer] = Object.values(answer);

    if (formattedAnswer === skipWord) {
      continue;
    }

    manager.addDocument(english, message, formattedAnswer);

    await manager.train();

    manager.save();

    try {
      const processedMessage = await manager.process(english, message);
      // convert any non JSON supported values like `Nan` -> `null`
      const sanitizedMessage = JSON.parse(JSON.stringify(processedMessage));
      await new IntentionModel({ _origin, ...sanitizedMessage }).save();
    } catch (e) {
      console.log(e.message);
    }
  }
})();
