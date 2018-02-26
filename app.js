// Setup basic express server 
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

/*
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'bear'
});

connection.connect();


app.get('/record_get', function (request, response) {
    let lvl = request.query.level;
    if (lvl === null || lvl === undefined){
        response.send("Error: not all arguments!");
        return;
    }
    let json = {};
    json['level'] = lvl;
    connection.query('SELECT * from records where level like ? ORDER BY time ASC;',lvl, function (err, rows) {
        if (err) throw err;
        let answer = {};
        answer['records'] = [];
        answer['level'] = lvl;
        for (let obj in rows) {
            answer['records'].push({
                "name":rows[obj]['name'],
                "time":rows[obj]['time'],
            });
        }
        response.send(JSON.stringify(answer));
    });
});

app.get('/record_set', function (request, response) {
    let lvl = request.query.level;
    if (lvl == null || request.query.name == null || request.query.time == null) {
        response.send("Error: not all arguments!");
        return;
    }
    connection.query("INSERT INTO records SET ?",
        {
            name: request.query.name,
            time: request.query.time,
            level: lvl
        },
        function (err) {
            if (err) throw err;
            response.send("ok");
        });
});*/

app.use(express.static(path.join(__dirname, 'public')));