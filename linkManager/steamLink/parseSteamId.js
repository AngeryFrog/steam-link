const https = require('https');

const config = require('../../config.json');

const getVanityUrl = (vanityUrl) => {
    return new Promise((result)=>{
        let options = {
            hostname: 'api.steampowered.com',
            port: 443,
            path: `/ISteamUser/ResolveVanityURL/v1/?key=${config.steamApiKey}&vanityurl=${vanityUrl}`,
            method: 'GET'
        };
          
        let req = https.request(options, res => {
            res.on('data', d => {
                result(d);
            });
        });

        req.end();
    });
};

module.exports = async (input) => {
    return new Promise(async (res)=>{
        let splitUrl = input.split('/');
        if(splitUrl[2]=='steamcommunity.com' && (splitUrl[3]=='profiles' || splitUrl[3]=='id')){
            let steamId = parseInt(splitUrl[4]);
            if(steamId && splitUrl[4].length==17){
                res(splitUrl[4])
            }else{
                let vanityRes = JSON.parse(await getVanityUrl(splitUrl[4]))
                if(vanityRes.response.success){
                    res(vanityRes.response.steamid);
                }else{
                    res(null);
                };
            };
        }else{
            res(null);
        };
    });
};