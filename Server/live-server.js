const express = require('express');
const cors = require('cors');
var fs = require('fs');

const app = express();

app.use(cors())

var path = require('path');

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/LLD och LKF.json'))
})

app.listen(2020, () => {
    console.log('server is listening on port 2020');
});