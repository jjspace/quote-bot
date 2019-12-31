const dbClient = require('../../db/dbClient');

module.exports = {
  name: 'delset',
  usage: 'delset [name]',
  description: 'Create a new set of quotes triggered by the set name. Names must be one word, all lowercase',
  execute(message, args) {
    if (!this.serverDb) {
      throw new Error('Missing ServerDb');
    }

    if (args.length !== 1) {
      message.channel.send('Improper number of arguments, requires 1');
      return;
    }

    const setName = args.shift();

    if (!setName.match(/^[a-z0-9-]+$/)) {
      // must be all lowercase, '-' allowed
      message.channel.send('Set names may only include, lowercase letters, numbers and the `-` character');
      return;
    }

    // TODO: add a confirmation check here, right now you could delete a lot in one fell swoop!

    // check for existing so don't delete quotes
    const existingSet = dbClient.getQuoteSet(this.serverDb, setName);
    if (!existingSet) {
      message.channel.send(`Quote set \`${setName}\` doesn't exist`);
    }
    else {
      dbClient.removeQuoteSet(this.serverDb, setName);
      message.channel.send(`Quote set \`${setName}\` deleted`);
    }
  },
};
