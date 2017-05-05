const Config = require('electron-config');
const config = new Config();
const configKey = 'dolla';

module.exports = {
    get: function () {
        return config.get(configKey);
    },
    set: function (obj) {
        config.set(configKey, obj);
    }
};