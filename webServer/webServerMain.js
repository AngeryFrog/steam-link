const https = require('https');
const fs = require('fs');

const linkSteam = require('../linkManager/linkSteam');

module.exports = class webServer{
    constructor(linkManager){
        this.linkManager = linkManager;
        const privateKey = fs.readFileSync('/etc/letsencrypt/live/femboys.cc/privkey.pem', 'utf8');
        const certificate = fs.readFileSync('/etc/letsencrypt/live/femboys.cc/cert.pem', 'utf8');
        const ca = fs.readFileSync('/etc/letsencrypt/live/femboys.cc/chain.pem', 'utf8');
        this.options = {
            key: privateKey,
            cert: certificate,
            ca: ca
        }
        this.webServer = https.createServer(this.options,(req, res)=>this.requestListener(req, res)).listen(5780)
    };

    requestListener(req, res){
        res.setHeader('Access-Control-Allow-Origin', 'https://discord.frogbot.dev');
        switch(req.url.split('/')[1]){
            case "css":
                res.end(fs.readFileSync('./webServer/http/css/index.css'));
                break;
            case "linksteam":
                res.end(fs.readFileSync('./webServer/http/www/linkSteam.html'));
                break;
            case "connectsteam":
                linkSteam(req, res, this.linkManager);
                break;
            default:
                res.end();
                break;
        }
    } 
}