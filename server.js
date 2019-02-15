const express = require("express")
const app = express()
var port = 1000


app.get("/", (req, res) => {
    res.send("HOLLA AMIGO");
});

app.listen(port, function(){
    console.log(`Server started on Port: ${port}`);
})