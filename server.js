const express = require("express")
const mysql = require("mysql")
const bodyParser = require("body-parser")
const app = express()
var port = 1000
app.use(bodyParser.json());
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tortilla"
})

app.get("/todos", (req, res) => {
    con.connect(function(err){
        let sql = "SELECT * FROM tortillas";
        con.query(sql, function(error, result, fields){
            res.send(result);
        });
    });
});

app.delete("/todos", (req, res) => {
    let id = req.body.id;
    con.connect(function(err){
        let sql = `DELETE FROM tortillas WHERE id=${id}`;
        con.query(sql, function(error, result, fields){
            if(!result){
                res.status(400).json({
                    "error": true,
                    "message": error
                });
            } else {
                res.send({'status': '1'})
            }
        });
    });
});

app.post("/todos", (req, res) => {
    let body = req.body;
    con.connect(function(err){        
        let sql = `INSERT INTO \`tortillas\` (userid, content, time) VALUES ('${body.userid}', '${body.content}', ${body.time})`;
        con.query(sql, function(error, result, fields){
            if(!result){
                res.status(400).json({
                    "error": "Error Occurred",
                    "status": '0'
                });
            } else {
                res.send({'status': '1'})
            }
        });
    });
});

app.listen(port, function(){
    console.log(`Server started on Port: ${port}`);
})