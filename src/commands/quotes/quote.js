const dbClient = require('../../db/dbClient');

module.exports = {
  name: 'quote',
  usage: 'quote [?set name]',
  description: 'Send a random quote. Quote will be from the given set if specified',
  execute(message, args) {
    if (!this.serverDb) {
      throw new Error('Missing ServerDb');
    }

    if (args.length > 1) {
      message.channel.send('Too many arguments, at most 1 allowed');
      return;
    }

    const setName = args.shift();

    if (setName && !dbClient.getQuoteSet(this.serverDb, setName)) {
      message.channel.send(`Set \`${setName}\` does not exist`);
      return;
    }

    const [sourceSet, quote] = dbClient.getRandomQuote(this.serverDb, setName);
    message.channel.send(`"${quote}" - ${sourceSet}`);
  },
};
