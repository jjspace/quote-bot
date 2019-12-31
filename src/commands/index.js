
const Discord = require('discord.js');
const ping = require('./ping');
const helpGen = require('./help');
// const mods = require('./mods/mods');
// const addmod = require('./mods/addmod');
// const delmod = require('./mods/delmod');
const quotesets = require('./quotesets/quotesets');
const addset = require('./quotesets/addset');
const delset = require('./quotesets/delset');
const quote = require('./quotes/quote');
const quotes = require('./quotes/quotes');
const addquote = require('./quotes/addquote');
const delquote = require('./quotes/delquote');
const quotebotprefix = require('./config/quotebotprefix');
const requirecommand = require('./config/requirecommand');
const quotecooldown = require('./config/quotecooldown');

const commands = new Discord.Collection();

commands.set(ping.name, ping);
// commands.set(mods.name, mods);
// commands.set(addmod.name, addmod);
// commands.set(delmod.name, delmod);
commands.set(quotesets.name, quotesets);
commands.set(addset.name, addset);
commands.set(delset.name, delset);
commands.set(quote.name, quote);
commands.set(quotes.name, quotes);
commands.set(addquote.name, addquote);
commands.set(delquote.name, delquote);
commands.set(quotebotprefix.name, quotebotprefix);
commands.set(requirecommand.name, requirecommand);
commands.set(quotecooldown.name, quotecooldown);

// Generate help command from command definitions
const help = helpGen(commands);
commands.set(help.name, help);

module.exports = commands;
