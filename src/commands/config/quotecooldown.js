const dbClient = require('../../db/dbClient');

module.exports = {
  name: 'quotecooldown',
  usage: 'quotecooldown [?seconds]',
  description: 'Set the cooldown between quotes in seconds. **NOTE:** Only applies to standard messages, not commands',
  execute(message, args) {
    if (!this.serverDb) {
      throw new Error('Missing ServerDb');
    }

    if (args.length > 1) {
      message.channel.send('Improper number of arguments, must be 1 or less');
      return;
    }
    if (args.length === 1) {
      const newValue = args.shift();

      dbClient.setQuoteCooldown(this.serverDb, newValue);
      message.channel.send(`Cooldown updated to \`${newValue}\` seconds`);
    }
    else {
      const currCooldown = dbClient.getQuoteCooldown(this.serverDb);
      message.channel.send(`The current cooldown is \`${currCooldown}\``);
    }
  },
};
