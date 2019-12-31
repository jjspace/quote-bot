const Discord = require('discord.js');
const { discordBotToken } = require('./config');
const logger = require('./logger');
const commands = require('./commands');
const db = require('./db/db').db();
const dbClient = require('./db/dbClient');

const client = new Discord.Client();
client.commands = commands;
client.cooldowns = new Discord.Collection();

client.once('ready', () => {
  logger.info(`I am ready! I am "${client.user.username}" connected to ${client.guilds.size} guilds`);
  if (process.send) {
    // send 'ready' for pm2
    process.send('ready');
  }
});

client.on('guildCreate', (guild) => {
  logger.info(`Invited to join new guild: "${guild.name || 'unknownName'}:${guild.id || 'unknownID'}"`);
  if (guild.available) {
    // recommended to see if guild is available before
    // performing operations or reading data from it.
    // you can check like this
    // guild.available indicates server outage

    const { id, name } = guild;

    const storedGuildId = dbClient.getServer(db, id);

    // check if we have config for it already
    // maybe they kicked the bot but want it back
    if (!storedGuildId.value()) {
      dbClient.addServer(db, id, name);
    }
  }
});

client.on('message', (message) => {
  const {
    guild,
    author,
    content,
  } = message;

  logger.info(`Received message: "${message.content}" (${message.embeds.length} embeds) from "${author.username || 'unknownAuthor'}:${author.id || 'unknownId'}"`);

  // === Gatekeeping ===
  if (author === client.user) {
    logger.info('Message from myself, no action');
    return;
  }
  if (author.bot) {
    logger.info('Message from another bot, ignore');
    return;
  }
  if (guild === null) {
    logger.info('Message was a DM, alert and ignore');
    message.channel.send('This bot does not currently accept DMs');
    return;
  }

  // Load server database or generate default one
  const serverDb = dbClient.getServer(db, guild.id);
  if (!serverDb.value()) {
    logger.info(`serverDb not found for "${guild.name}:${guild.id}". Generating new default`);
    dbClient.addServer(db, guild.id, guild.name);
    message.channel.send('Current Guild settings not found, defaults were generated.\nIf you think this is wrong contact the bot developer');
    return;
  }
  logger.info(`Loaded serverDb for guild "${guild.name}:${guild.id}"`);

  // TODO: check if member has access to commands. Mod commands already set up

  const commandPrefix = dbClient.getCommandPrefix(serverDb);

  // === Message Handling ===
  if (content.startsWith(commandPrefix)) {
    const args = content.slice(commandPrefix.length).split(/\s+/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) {
      message.channel.send(`Unrecognized command. Use \`${commandPrefix}help\` to see available commands`);
      return;
    }
    const command = client.commands.get(commandName);

    try {
      command.serverDb = serverDb;
      command.execute(message, args);
      return;
    }
    catch (error) {
      logger.error(error);
      message.reply('There was an error trying to execute that command!');
    }
  }
  else {
    // normal message, no prefix

    const requireCommand = dbClient.getRequireCommand(serverDb);
    if (requireCommand) {
      return;
    }

    const setNames = Object.keys(dbClient.getQuoteSets(serverDb));

    const normalizedContent = content.toLowerCase();
    const msgContainsSetName = setNames.reduce((acc, name) => {
      if (!acc && normalizedContent.includes(name)) {
        // if not already found a set name and find one, return that
        return name;
      }
      return acc;
    }, null);

    if (msgContainsSetName) {
      const now = Date.now();
      const serverCooldown = dbClient.getQuoteCooldown(serverDb);
      const cooldownAmount = (serverCooldown || 3) * 1000;

      // in this setup cooldowns are guild based, not command or user based
      if (!client.cooldowns.has(guild.id)) {
        // if not already a timestamp, set to cooldown amount before now so it works the first time
        client.cooldowns.set(guild.id, now - cooldownAmount - 1);
      }

      // check timestamp
      if (client.cooldowns.has(guild.id)) {
        const expirationTime = client.cooldowns.get(guild.id) + cooldownAmount;

        if (now > expirationTime) {
          // if off cooldown, send message
          logger.info(`Found set name ${msgContainsSetName} in message, sending quote`);
          const [sourceSet, quote] = dbClient.getRandomQuote(serverDb, msgContainsSetName);
          message.channel.send(`"${quote}" - ${sourceSet}`);
          client.cooldowns.set(guild.id, now);
        }
      }
    }
  }
});

client.login(discordBotToken);

process.on('SIGINT', () => {
  logger.info('Caught Interupt Signal, quitting');

  client.destroy();
  process.exit();
});
