/* global __dirname */
/* global global */
function getConfig(key, defaultVal) {
  if(_CONFIG_.hasOwnProperty(key)) {
    return _CONFIG_[key];
  }
  var resVal = fetchFromObject(key);
  if(resVal) {
    return resVal;
  }
  return defaultVal;
}

global.GET_CONFIG = getConfig;

var _CONFIG_ = {
  app_base_path: __dirname + '/',
  port: 2368,
  ip: 'localhost'
};

function fetchFromObject(obj, prop) {
    if(typeof obj === 'undefined') {
        return false;
    }

    var _index = prop.indexOf('.')
    if(_index > -1) {
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    }

    return obj[prop];
}
_CONFIG_['app_log_path'] = _CONFIG_.app_base_path + 'logs/';
_CONFIG_['is_production'] = true;
_CONFIG_['app_asset_path'] = _CONFIG_.app_base_path + 'public_html/assets/';

module.exports = getConfig;