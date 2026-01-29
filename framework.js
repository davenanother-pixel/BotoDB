const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const db = require("./database");

function extractMiniScript(text) {
  const match = text.match(/#BOTO([\s\S]*?)END BOTO/);
  if (!match) return null;

  const lines = match[1]
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const config = {};
  for (const line of lines) {
    if (line.startsWith("SEND DATA BotoDB:")) {
      config.channel = line.split(":")[1].trim();
    }
    if (line === "FROM localStorage") {
      config.source = "localStorage";
    }
    if (line.startsWith("KEY")) {
      config.key = line.split(" ")[1];
    }
    if (line === "CLEAR AFTER SEND") {
      config.clear = true;
    }
  }

  return config;
}

async function processSite(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const mini = extractMiniScript(html);
  if (!mini) return;

  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable"
  });

  await new Promise(r => dom.window.addEventListener("load", r));

  const storage = dom.window.localStorage;
  const raw = storage.getItem(mini.key);
  if (!raw) return;

  const data = JSON.parse(raw);
  if (!Array.isArray(data)) return;

  db.append(mini.channel, data);

  if (mini.clear) {
    storage.removeItem(mini.key);
  }
}

module.exports = { processSite };
