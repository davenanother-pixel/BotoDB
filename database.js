const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "storage.json");

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      createdAt: new Date().toISOString(),
      channels: {}
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function append(channel, data) {
  const db = loadDB();
  if (!db.channels[channel]) {
    db.channels[channel] = [];
  }
  db.channels[channel].push(...data);
  saveDB(db);
}

module.exports = { append };
