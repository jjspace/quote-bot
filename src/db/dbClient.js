const { getRandElem } = require('../utils');
// client design inspired by: https://saltsthlm.github.io/protips/lowdb.html

// NOTE: this method does NOT return a value but instead the server obj
module.exports.getServer = (db, serverId) => db.get('servers').getById(serverId);

module.exports.addServer = (db, serverId, serverName) => {
  // TODO: Extract these defaults to config?
  const newServer = {
    id: serverId,
    name: serverName,
    commandPrefix: '!',
    requireCommand: false,
    quoteCooldown: 3,
    allowedRoles: [],
    quoteSets: {},
  };
  db.get('servers').insert(newServer).write();
};

module.exports.getQuoteCooldown = (serverDb) => serverDb.get('quoteCooldown').value();
module.exports.setQuoteCooldown = (serverDb, newValue) => serverDb.set('quoteCooldown', newValue).write();

module.exports.getCommandPrefix = (serverDb) => serverDb.get('commandPrefix').value();
module.exports.setCommandPrefix = (serverDb, newValue) => serverDb.set('commandPrefix', newValue).write();

module.exports.getRequireCommand = (serverDb) => serverDb.get('requireCommand').value();
module.exports.setRequireCommand = (serverDb, newValue) => serverDb.set('requireCommand', newValue).write();

module.exports.getAllowedRoles = (serverDb) => serverDb.get('allowedRoles').value();
module.exports.addAllowedRole = (serverDb, newRole) => {
  serverDb
    .get('allowedRoles')
    .upsert(newRole)
    .write();
};
module.exports.removeAllowedRole = (serverDb, roleId) => {
  serverDb.get('allowedRoles')
    .pull(roleId)
    .write();
};

module.exports.getQuoteSets = (serverDb) => serverDb.get('quoteSets').value();
module.exports.getQuoteSet = (serverDb, setName) => serverDb.get('quoteSets').get(setName).value();
module.exports.addQuoteSet = (serverDb, setName) => serverDb.get('quoteSets').set(setName, []).write();
// TODO: add backup of deleted sets as {setName, time, quotes} or something for recovery
module.exports.removeQuoteSet = (serverDb, setName) => serverDb.get('quoteSets').unset(setName).write();

module.exports.addQuote = (serverDb, setName, quote) => serverDb.get('quoteSets').get(setName).push(quote).write();
module.exports.removeQuote = (serverDb, setName, quote) => serverDb.get('quoteSets').get(setName).pull(quote).write();
module.exports.removeQuoteByIndex = (serverDb, setName, index) => serverDb.get('quoteSets').get(setName).splice(index, 1).write();
module.exports.getRandomQuote = (serverDb, setName) => {
  let sourceSet = setName;
  let quotes = [];
  if (setName) {
    quotes = this.getQuoteSet(serverDb, setName);
  }
  else {
    const sets = this.getQuoteSets(serverDb);
    const randSet = getRandElem(Object.keys(sets));
    sourceSet = randSet;
    quotes = sets[randSet];
  }
  return [sourceSet, getRandElem(quotes)];
};
