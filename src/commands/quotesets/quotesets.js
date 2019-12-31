const dbClient = require('../../db/dbClient');

module.exports = {
  name: 'quotesets',
  description: 'Get a list of all quote sets. Sets are used to group quotes into specific trigger words. Using the names of sets in messages will trigger random quotes from that set.',
  execute(message) {
    if (!this.serverDb) {
      throw new Error('Missing ServerDb');
    }

    const sets = dbClient.getQuoteSets(this.serverDb);

    const setString = Object.entries(sets).map(([key, value]) => `\`${key}\`(${value.length})`);

    message.channel.send(`Current Quote Sets: ${setString.join(', ')}`);
  },
};
