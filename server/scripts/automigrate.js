var server = require('../server');
var ds = server.dataSources.mysqldb;

ds.automigrate(function(err) {
  if(err) throw err;
  console.log('tables created');
  process.exit(0);
});