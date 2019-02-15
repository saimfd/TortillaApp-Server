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
        if(err) throw err;
        let sql = "SELECT * FROM tortillas";
        con.query(sql, function(error, result, fields){
            res.send(result);
        });
    });
});

app.listen(port, function(){
    console.log(`Server started on Port: ${port}`);
})