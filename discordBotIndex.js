const Discord = require('discord.js');
const client = new Discord.Client();

const EventEmitter = require('events');
const { setInterval } = require('timers');

const config = require('./config.json');
const messageHandle = require('./messageHandler/handleMessage')

module.exports = class discordBot extends EventEmitter{
  constructor(linkManager) {
    super();
    this.linkManager = linkManager;
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      client.user.setActivity('!help for commands', { type:"LISTENING" });
    });
    
    client.on('message', (msg) => {
      this.messageHandle(msg, client)
    });
    
    client.login(config.token); 
  };

  messageHandle(msg, client){
    messageHandle(msg, client, this.linkManager)
  };
};