/* global GET_CONFIG */
// NodeJS includes
'use strict';

var cluster = require('cluster');
var express = require('express');
var i18n = require('i18n');
var http = require('http');

// Custom includes
var config = require('./config');
var logger = require('./logger');
var networkInterface = require(__dirname + '/lib/network-utils');

// Count the machine's CPUs
var cpuCount = require('os').cpus().length;
var app = express();

// The master process - will only be used when on PROD
if (GET_CONFIG('is_production') && cluster.isMaster) {
  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', function() {
    cluster.fork();
  });
} else {  
  app.use(function (req, res, next) {
    res.setHeader('X-Powered-By', 'Abijeet Patro');
    next();
  });
  
  i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: GET_CONFIG('app_base_path') + 'locales',
    objectNotation: true
  });
  
  app.set('view engine', 'ejs');
  app.locals = {
    i18n: i18n.__,
    isProd: GET_CONFIG('is_production'),
  };  
  app.set('views', __dirname + '/public_html/');
  app.use(i18n.init);
  
  app.get('/', function(request, response) {
    var fileName = 'index.ejs';
    response.render(fileName);  
  });
  
  app.get('/:filename', function (request, response) {
    var fileName = request.params.filename;
    response.render(fileName + '.ejs');
  });
  
  var ipToUse = networkInterface.getIpAddressForNetworkInterface() || GET_CONFIG('ip');
  http.createServer(app).listen(GET_CONFIG('port'), ipToUse, function(error) {
    if (error) {
      logger.logAppErrors(error);
      process.exit(10);
    }
    console.log('Express is listening on http://' + ipToUse + ':' + GET_CONFIG('port'));
  });
}