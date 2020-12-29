const querystring = require('querystring');
const https = require('https');
const mysql = require('mysql');

const config = require('../config.json');

const getSteamId = require('./steamLink/parseSteamId');

const verifyNotBot = (data, cb) => {
    return new Promise((result)=>{
        const options = {
            hostname: 'www.google.com',
            port: 443,
            path: `/recaptcha/api/siteverify?secret=${config.recapatchaSecret}&response=${data.token}`,
            method: 'POST'
        }
          
        const req = https.request(options, res => {
            res.on('data', d => {
                result(d);
            });
        });
        req.end();
    })
};

const linkSteamDisc = (discordId, steamId) => {
    return new Promise((result)=>{
        let con = mysql.createConnection({
            host:"frogbot.dev",
            user:config.mysqluser,
            password:config.mysqlpass,
            database:config.database
        });
        con.connect(function(err) {
            if (err) throw err;
            let sqlQuery = `SELECT * FROM linkedSteam WHERE discordAccID=${discordId};`;
            con.query(sqlQuery, (err, res)=>{
                if(err){result(false)}
                else{
                    if(res.length==0){
                        sqlQuery=`INSERT INTO linkedSteam (discordAccID, steamID) VALUES (${discordId}, ${steamId})`
                    }else{
                        sqlQuery=`UPDATE linkedSteam SET steamID = ${steamId} WHERE discordAccID=${discordId};`
                    }
                    con.query(sqlQuery, (err)=>{
                        if(err){result(err)}
                        else{
                            result(true);
                            con.end();
                        }
                    })
                }
            })
        });
    })
}

module.exports = async (req, res, linkManager) => {
    res.writeHead(200)
    if(req.method.toLowerCase()=='post'){
        let dataAcc = '';
        req.on('data', d =>{
            dataAcc+=d;
        });
        req.on('end', async (d)=>{
            if(d){dataAcc+=d;}
            let finalData = querystring.decode(dataAcc)
            let antiBot = await verifyNotBot(finalData)
            antiBot = JSON.parse(antiBot)
            if((!antiBot.success || antiBot.score<0.5) ){
                res.end(JSON.stringify({success: false, err: "'You have been denied linking your steam account due to suspicious activity'"}))
            }else{
                let discordId = linkManager.checkTempToken(finalData.linkToken);
                if(discordId){
                    let steamId = await getSteamId(finalData.steamUrl);
                    if(steamId){
                        let accountConnect = await linkSteamDisc(discordId.discordId, steamId)
                        if(accountConnect){
                            res.end(JSON.stringify({success: true}))
                        }else{
                            res.end(JSON.stringify({success: false, err: "There was an error connecting your discord account"}))
                        }
                    }else{
                        res.end(JSON.stringify({success: false, err: "We could not find the steam account for this url"}))
                    }
                }else{
                    res.end(JSON.stringify({success: false, err: "You must have a legitmate link to link your steam account"}))
                }
            }
        });
    }else{
        res.end(JSON.stringify({success: false, err: "This requires a POST request to use"}))
    };
};