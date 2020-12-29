const https = require('https');

const config = require('../../config.json');

module.exports = (id) => {
    return new Promise((result)=>{
        let options = {
            hostname: 'api.steampowered.com',
            port: 443,
            path: `/ISteamUser/GetPlayerSummaries/v0002/?key=${config.steamApiKey}&steamids=${id}`,
            method: 'GET'
        };

        let dataAcc = '';

        let req = https.request(options, res => {
            res.on('data', d => {
                dataAcc += d;
            });

            res.on('end', ()=>{
                try{
                    JSON.parse(dataAcc)
                    result((JSON.parse(dataAcc)).response.players)
                }catch(err){
                    result([])
                };
            });
        });
          
        req.on('error', error => {
            console.error(error)
        });
          
        req.end()
    });
};
