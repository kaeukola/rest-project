// server.js
var api = require('./api');
var port = process.env.PORT || 3080;

var server = api.listen(port, function() {
  console.log('Express server listening on port ' + port);
});


module.exports = server