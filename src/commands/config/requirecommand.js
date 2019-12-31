const dbClient = require('../../db/dbClient');

module.exports = {
  name: 'requirecommand',
  usage: 'requirecommand [yes|no]',
  description: 'Set whether quotes can be sent for normal messages. Defaults to `Yes`',
  execute(message, args) {
    if (!this.serverDb) {
      throw new Error('Missing ServerDb');
    }

    if (args.length !== 1) {
      message.channel.send('Improper number of arguments, requires 1');
      return;
    }

    const newValue = args.shift();

    // written this way to default to default to true if anything but "no" is entered
    const newValueBool = newValue.toLowerCase() !== 'no';

    dbClient.setRequireCommand(this.serverDb, newValueBool);
    message.channel.send(`Command Prefix updated to \`${newValueBool ? 'Yes' : 'No'}\``);
  },
};
