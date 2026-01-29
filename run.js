const path = require("path");
const { processSite } = require("./BotoDB/framework");

(async () => {
  await processSite(path.join(__dirname, "site/app.html"));
})();
