const mysql = require('mysql');

const config = require('../config.json')

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(config.token);

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

module.exports = class linkManager{
    constructor(params) {
        this.tempTokens = new Map();
    };

    addTempToken(discordId){
        let token = genRanHex(20);
        if(this.tempTokens.has(token)){
            this.tempTokens.delete(token);
        }
        this.tempTokens.set(token, {discordId});
        setTimeout(()=>{
            this.tempTokens.delete(token);
        },20000);
        return token;
    };

    checkTempToken(token){
        if(this.tempTokens.has(token)){
            return(this.tempTokens.get(token))
        }else{
            return false;
        }
    };
}; 