const https = require('https');

const config = require('../../config.json');

module.exports = (id) => {
    return new Promise((result)=>{
        let options = {
            hostname: 'api.steampowered.com',
            port: 443,
            path: `/IPlayerService/GetSteamLevel/v1/?key=${config.steamApiKey}&steamid=${id}`,
            method: 'GET'
        };

        let dataAcc = '';

        let req = https.request(options, res => {
            res.on('data', d => {
                dataAcc += d;
            });

            res.on('end', ()=>{
                result(JSON.parse(dataAcc).response)
            });
        });
          
        req.on('error', error => {
            console.error(error)
        });
          
        req.end()
    });
};
