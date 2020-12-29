const discordBot = require('./discordBotIndex');
const webServer = require('./webServer/webServerMain');
const linkManager = require('./linkManager/linkManager');

const linkControler = new linkManager();

const webServerManager = new webServer(linkControler);

const discordBotManager = new discordBot(linkControler);