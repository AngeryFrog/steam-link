const mysql = require('mysql');

const config = require('../config.json')

module.exports = (id) => {
    return new Promise((result)=>{
        let con = mysql.createConnection({
            host:"frogbot.dev",
            user:config.mysqluser,
            password:config.mysqlpass,
            database:config.database
        });
        con.connect(function(err) {
            if (err) throw err;
            let sqlQuery = `SELECT steamID FROM linkedSteam WHERE discordAccID=${id};`;
            con.query(sqlQuery, (err, res)=>{
                if(err){result(false)}
                else{
                    if(res.length==0){
                        result(false)
                        con.end();
                    }else{
                        result(res);
                        con.end();
                    }
                }
            })
        });
    });
};