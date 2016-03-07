/* global __dirname */
/* global global */
function getConfig(key, defaultVal) {
  if(_CONFIG_.hasOwnProperty(key)) {
    return _CONFIG_[key];
  }
  return defaultVal;
}

global.GET_CONFIG = getConfig;

var _CONFIG_ = {
  app_base_path: __dirname + '/', 
  port: 2368,
  ip: 'localhost'   
};

_CONFIG_['app_log_path'] = _CONFIG_.app_base_path + 'logs/';
_CONFIG_['is_production'] = false;
_CONFIG_['app_asset_path'] = _CONFIG_.app_base_path + 'public_html/assets/';

module.exports = getConfig;