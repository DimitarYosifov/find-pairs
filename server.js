const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
const cors = require("cors");
app.use(cors());
app.set('port', process.env.PORT || 8080);
const server = app.listen(app.get('port'), function () {
  console.log('listening on port ', server.address().port);  
});