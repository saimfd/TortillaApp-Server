const express = require("express")
const mysql = require("mysql")
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt')
const dotenv = require("dotenv")
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const app = express()
var port = 1000
app.use(bodyParser.json());
dotenv.config();
var secret = process.env.JWT_SECRET;
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tortilla"
})

app.get("/todos", (req, res) => {
    username = req.query.username;
    con.connect(function(err){
        let sql = `SELECT * FROM tortillas WHERE userid='${username}'`;
        con.query(sql, function(error, result, fields){
            if(error){
                res.send(error);
            }
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

app.post("/auth/signup", (req, res) => {
    let username = req.body.username;
    let password = bcrypt.hashSync(req.body.password, 10);
    let datenow = new Date().toISOString().slice(0, 19).replace('T', ' ');;
    con.connect((err) => {
        let sql = `SELECT * FROM users WHERE username='${username}'`;
        con.query(sql, (error, result, fields) => {
            if(result.length > 0){
                res.status(200).json({
                    message: "User Already Exists."
                });
            } else {
                let sql = `INSERT INTO users (username, password, created_at) VALUES('${username}', '${password}', '${datenow}')`;
                con.query(sql, (error, result, fields) => {
                    if(error){
                        res.status(400).json({
                            error: true,
                            message: error
                        })
                    } else {
                        res.status(200).json({
                            message: "User Added Successfully."
                        });
                    }
                });
            }
        });
    });
});

app.post('/auth/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    con.connect((err) => {
        let sql = `SELECT * FROM users WHERE username='${username}'`;
        con.query(sql, (err, result, fields) => {
            if(result.length > 0){
                if(bcrypt.compareSync(password, result[0].password)){
                    var token = jwt.sign({
                        userID: username
                    }, secret, {expiresIn: '2h'});
                    res.json(200, {
                        message: "User Logged in.",
                        token: token
                    })
                } else {
                    res.json(400, {
                        error: true,
                        message: "Wrong Username/Password"
                    })
                }
            }
        });
    });
});

app.get('/users', (req, res) => {
    let username =  req.query.username;
    con.connect(function(err){
        let sql = `SELECT * FROM users WHERE username='${username}'`;
        con.query(sql, function(error, result, fields){
            res.json({
                isAvailable: result.length
            })
        });
    });
});

app.post("/todos", (req, res) => {
    let body = req.body;
    con.connect(function(err){        
        let sql = `INSERT INTO \`tortillas\` (userid, content, time) VALUES ('${body.userid}', '${body.content}', '${body.time}')`;
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

app.listen(port, function(){
    console.log(`Server started on Port: ${port}`);
})