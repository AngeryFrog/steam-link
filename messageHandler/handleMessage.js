const Discord = require('discord.js');
const mysql = require('mysql');

const config = require('../config.json');

const steamStats = require('./steamStats');
const steamIDStats = require('./steamIDStats');

const searchDiscID = require('../linkManager/searchDiscID');

module.exports = async (msg, client, linkManager) => {
    if(msg.content[0]=="!"){
        switch(msg.content.substring(1).split(" ")[0]){
            case "help":
                msg.channel.send(
                    new Discord.MessageEmbed().setColor('#0099ff').setTitle('Help').addFields(
                        { name: '!help', value: 'Gives this message' },
                        { name: '!linksteam', value: 'Gives you a temporary link to link or update your steam account too your discord account' },
                        { name: '!showsteam <ping user> (example: !showsteam @Angery Frog)', value: 'Shows you the steam stats of the person pinged'},
                        { name: '!searchsteam <steamID> (example: !searchsteam 76561198149150361)', value: 'Searches and shows the steam details of a person'}
                    )
                );
                break;
            case "linksteam":
                let token = linkManager.addTempToken(msg.author.id);
                let steamID = await searchDiscID(msg.author.id);
                if(steamID[0]){
                    msg.author.send(
                        new Discord.MessageEmbed().setColor('#0099ff').setTitle('You already have an account created but you can change it here!').setDescription(`[Change your account!](https://discord.frogbot.dev/linksteam/${token}), too get your steam URL follow [this tutorial](https://www.youtube.com/watch?v=njm7qvI5ucU)`)
                    );
                }else{
                    msg.author.send(
                        new Discord.MessageEmbed().setColor('#0099ff').setTitle('Connect your steam account too your discord!').setDescription(`[Connect your account!](https://discord.frogbot.dev/linksteam/${token}), too get your steam URL follow [this tutorial](https://www.youtube.com/watch?v=njm7qvI5ucU)`)
                    );
                };
                break;
            case "showsteam":
                steamStats(msg);
                break;
            case "searchsteam":
                steamIDStats(msg);
                break;
            default:
                break;
        }
    };
};