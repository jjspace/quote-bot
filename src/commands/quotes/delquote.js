const dbClient = require('../../db/dbClient');
const logger = require('../../logger');

module.exports = {
  name: 'delquote',
  usage: 'delquote [set name] [...quote]',
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
    if (args[0].match(/^\d+$/)) {
      // if second arg is a number
      const index = +args.shift() - 1;
      if (index >= dbClient.getQuoteSet(this.serverDb, setName).length) {
        message.channel.send(`Quote \`${index}\` does not exist`);
        return;
      }
      logger.info(`Deleting quote index ${index} from set "${setName}"`);
      dbClient.removeQuoteByIndex(this.serverDb, setName, index);
    }
    else {
      const quote = args.join(' ');

      if (!dbClient.getQuoteSet(this.serverDb, setName).includes(quote)) {
        message.channel.send(`Quote "${quote}" does not exist`);
        return;
      }

      logger.info(`Deleting quote index ${quote} from set "${setName}"`);
      dbClient.removeQuote(this.serverDb, setName, quote);
    }
    message.channel.send(`Quote removed from set \`${setName}\``);
  },
};
