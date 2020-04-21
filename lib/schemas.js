const { Schema } = require('mongoose');

/**
 * Schema for a Slack message
 * @type {Schema}
 */
exports.SlackMessageSchema = new Schema({
  id: String,
  timestamp: Date,
  channelId: String,
  conversation: { id: String, thread_ts: Date, team: String },
  from: { id: String },
  recipient: { id: String },
  channelData: new Schema({
    client_msg_id: String,
    type: String,
    text: String,
    user: String,
    ts: String,
    team: String,
    blocks: Array,
    channel: String,
    event_ts: String,
    channel_type: String,
  }),
  text: String,
  type: String,
});

/**
 * Schema for a Slack message intention... though the naming could be better
 * @type {Schema}
 */
exports.IntentionSchema = new Schema({
  _origin: {
    type: Schema.ObjectId,
    ref: 'SlackMessage',
  },
  locale: String,
  utterance: String,
  languageGuessed: Boolean,
  localeIso2: String,
  language: String,
  classifications: Array,
  intent: String,
  score: Number,
  domain: String,
  sourceEntities: Array,
  entities: Array,
  answers: Array,
  answer: String,
  actions: Array,
  sentiment: new Schema({
    score: Number,
    numWords: Number,
    numHits: Number,
    average: Number,
    type: String,
    locale: String,
    vote: String,
  }),
});
