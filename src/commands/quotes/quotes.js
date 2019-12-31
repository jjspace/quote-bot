const dbClient = require('../../db/dbClient');

const createQuoteList = ([setName, quotes]) => {
  const quoteList = quotes.map((val, i) => `${i + 1}: ${val}`).join('\n');
  return `\`${setName}\`:\n${quoteList}`;
};

module.exports = {
  name: 'quotes',
  usage: 'quotes [?set name]',
  description: 'List all quotes. If a set name is provided, list only that set',
  execute(message, args) {
    if (!this.serverDb) {
      throw new Error('Missing ServerDb');
    }

    if (args.length > 1) {
      message.channel.send('Too many arguments, at most 1 allowed');
      return;
    }

    const setName = args.shift();

    if (setName) {
      const quotes = dbClient.getQuoteSet(this.serverDb, setName);
      message.channel.send(createQuoteList([setName, quotes]));
    }
    else {
      const sets = dbClient.getQuoteSets(this.serverDb);
      const setString = Object.entries(sets).map(createQuoteList);
      message.channel.send(`Current Quote Sets:\n${setString.join('\n')}`);
    }
  },
};
