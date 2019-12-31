const dbClient = require('../../db/dbClient');

module.exports = {
  name: 'addquote',
  usage: 'addquote [set name] [...quote]',
  description: 'Add a quote to the given set',
  execute(message, args) {
    if (!this.serverDb) {
      throw new Error('Missing ServerDb');
    }

    if (args.length < 2) {
      message.channel.send('Not enough arguments, need at least 2');
      return;
    }

    const setName = args.shift();
    const quote = args.join(' ');

    if (dbClient.getQuoteSet(this.serverDb, setName)) {
      dbClient.addQuote(this.serverDb, setName, quote);
      message.channel.send(`Quote added to set \`${setName}\``);
    }
    else {
      message.channel.send(`Quote set \`${setName}\` does not exist`);
    }
  },
};
