/* global GET_CONFIG */
'use strict';

var winston = require('winston');
var util = require('util');
var WinstonDailyTransport = require('winston-daily-rotate-file');

var logger = (function() {
  var errLogger = new(winston.Logger)({
    transports: [new WinstonDailyTransport({
      filename: GET_CONFIG('app_log_path') + 'exceptions.log_',
      timestamp: true,
      prettyPrint: false,
      json: false,
      datePattern: 'yyyy-MM-dd'
    })],
    exceptionHandlers: [new WinstonDailyTransport({
      filename: GET_CONFIG('app_log_path') + 'exceptions.log_',
      json: false,
      timestamp: true,
      prettyPrint: true,
      datePattern: 'yyyy-MM-dd'
    })],
    exitOnError: false
  });

  var infoLogger = new(winston.Logger)({
    transports: [new winston.transports.Console({
      json: false,
      timestamp: true
    }), new WinstonDailyTransport({
      filename: GET_CONFIG('app_log_path') + 'debug.log_',
      json: false,
      timestamp: true,
      datePattern: 'yyyy-MM-dd'
    })]
  });
  
  var writeErrLog = function(err) {
    var errStr = err.message + '\n';
    errStr += '\n----------\n';
    errStr += err.stack + '\n';
    errStr += '\n----------\n----------\n';
    errLogger.error(errStr);
  };
  
  var writeInfoLog = function(logMsg, logObj) {
    var logStr = logMsg + '\n';
    logStr += '\n----------\n';
    if(logObj) {
      logStr += util.inspect(logObj) + '\n';
    }
    logStr += '\n----------\n----------\n';
    infoLogger.error(logStr);
  };
  
  return {
    writeLogErr: writeErrLog,
    writeInfoLog: writeInfoLog
  };
}());

module.exports = logger;