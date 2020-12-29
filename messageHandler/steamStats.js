const Discord = require('discord.js');

const config = require('../config.json');

const steamInfoFetch = require('../linkManager/steamLink/fetchGeneralInfo');
const steamGameFetch = require('../linkManager/steamLink/fetchOwnedGames');
const steamLevelFetch = require('../linkManager/steamLink/fetchSteamLevel');
const steamMostRecentGameFetch = require('../linkManager/steamLink/fetchRecentGames');

const searchDiscID = require('../linkManager/searchDiscID');

const searchTopGames = require('./utils/topGameSearch');
const playtimeUtils = require('./utils/playtimeUtils');


const steamMsgSend = async(steamID, msg) => {
    let steamInfo = await steamInfoFetch(steamID[0].steamID);
    if(steamInfo){
        let steamGames = await steamGameFetch(steamID[0].steamID);
        let steamLevel = await steamLevelFetch(steamID[0].steamID);
        let steamRecentGames = await steamMostRecentGameFetch(steamID[0].steamID);
        let steamInfoMsg = new Discord.MessageEmbed().setColor('#0099ff').setTitle(`${steamInfo[0].personaname}`).setURL(`https://steamcommunity.com/profiles/${steamID[0].steamID}`);
        if(steamInfo[0].avatarmedium){
            steamInfoMsg.setThumbnail(steamInfo[0].avatarmedium)
        }
        if(steamInfo[0].timecreated){
            steamInfoMsg.addField('Date created:', `${new Date(steamInfo[0].timecreated*1000).toString().slice(0, -49)}`)
        }
        if(steamInfo[0].gameextrainfo){
            steamInfoMsg.addField('Currently playing:', `[${steamInfo[0].gameextrainfo}](https://store.steampowered.com/app/${steamInfo[0].gameid})`)
        }
        if(steamLevel.player_level){
            steamInfoMsg.addField('Player level:', `${steamLevel.player_level}`);
        }
        if(steamGames.game_count){
            steamInfoMsg.addField('Num of owned games:', `${steamGames.game_count}`);
        }
        if(steamGames.games){
            let topGames = searchTopGames(steamGames.games);
            let topGamesList = '';
            if(topGames[0]){
                topGamesList = topGamesList + `[${topGames[0].name}](https://store.steampowered.com/app/${topGames[0].appid}) for ${playtimeUtils.playTimeConvert(topGames[0].playtime_forever)}`
            };
            if(topGames[1]){
                topGamesList = topGamesList + `\n[${topGames[1].name}](https://store.steampowered.com/app/${topGames[1].appid}) for ${playtimeUtils.playTimeConvert(topGames[1].playtime_forever)}`
            };
            if(topGames[2]){
                topGamesList = topGamesList + `\n[${topGames[2].name}](https://store.steampowered.com/app/${topGames[2].appid}) for ${playtimeUtils.playTimeConvert(topGames[2].playtime_forever)}`
            };
            if(topGames[0]){
                steamInfoMsg.addField('Top played games:', topGamesList);
            };
            steamInfoMsg.addField('Total playtime:', `${playtimeUtils.playTimeConvert(playtimeUtils.totalPlayTime(steamGames.games))}`);
        }
        if(steamRecentGames.games){
            steamInfoMsg.addField('Most recently played game:', `[${steamRecentGames.games[0].name}](https://store.steampowered.com/app/${steamRecentGames.games[0].appid}) for ${playtimeUtils.playTimeConvert(steamRecentGames.games[0].playtime_2weeks)} in the last 2 weeks`, true);
        }
        msg.channel.send(steamInfoMsg);
    }else{
        let steamInfoMsg = new Discord.MessageEmbed().setColor('#0099ff').setTitle(`There was an error in getting this account!`).setURL(`https://steamcommunity.com/profiles/${steamID[0].steamID}`);
        msg.channel.send(steamInfoMsg);
    }
};

module.exports = async (msg) => {
    if(msg.content.split(" ").length == 1){
        let steamID = await searchDiscID(msg.author.id)
        if(steamID[0]){
            steamMsgSend(steamID, msg)
        }else{
            msg.channel.send(
                new Discord.MessageEmbed().setColor('#0099ff').setTitle('You do not have a steam account linked too your profile!')
            )
        }
    }else{
        let msgArgs = msg.content.split(" ");
        let matches = msgArgs[1].slice(3, -1);
        if(!matches){
            msg.channel.send(
                new Discord.MessageEmbed().setColor('#0099ff').setTitle('You must mention a user!')
            );
        }else{
            let steamID = await searchDiscID(matches)
            if(steamID[0]){
                steamMsgSend(steamID, msg)
            }else{
                msg.channel.send(
                    new Discord.MessageEmbed().setColor('#0099ff').setTitle('You do not have a steam account linked too this profile!')
                )
            }
        }
    };
};