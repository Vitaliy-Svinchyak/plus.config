function Config(options) {
    this._new(options);
}

Config.isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}


var config = {

    _new: function (options = {}) {
        var Provider = require('nconf').Provider;
        this._config = new Provider();

        this.dir = '.';
        this.env = 'dev';
        this.options = {};

        this.configName = 'config';
        this.parametersName = 'parameters';

        for (let key in options) {
            this[key] = options[key];
        }

        if (!Config.isArray(this.dir))
            this.dir = [this.dir];

        this._setup();
        this._load();

    },
    _addFiles: function () {

        var dirs = this.dir.slice().reverse();

        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            this._config.add('parameters-' + i, {type: 'file', file: dir + '/' + this.parametersName + '.json'});
            this._config.add('environment-' + i, {
                type: 'file',
                file: dir + '/' + this.configName + '_' + this.env + '.json'
            });
            this._config.add('global-' + i, {type: 'file', file: dir + '/' + this.configName + '.json'});
        }
    },
    _setupOptions: function () {
        this.fill(this.options);
    },
    _setup: function () {

        this._setupOptions();

        this._config.env("__");
        this._addFiles();
    },

    _load: function () {
        this._config.load();

        this._config.set('env', this.env);
        this.options = {...this.options, ...(this._config.get('NODE_CONFIG') || {})};

        this._loadXConfig();
        this._setupOptions();
    },
    _loadXConfig: function () {
        process.env.NODE_ENV = this.env;
        process.env.SUPPRESS_NO_CONFIG_WARNING = 1;

        for (var i = 0; i < this.dir.length; i++) {
            process.env.NODE_CONFIG_DIR = this.dir[i];
            this._xConfig = require('config');

            this.fill(this._xConfig);
            this.fill(this._xConfig.util.loadFileConfigs());
        }
    },
    get: function (name) {
        name = name ? ('' + name).replace('.', ':') : name;
        return this._config.get(name);
    },
    set: function (name, value) {
        name = name ? ('' + name).replace('.', ':') : name;
        this._config.set(name, value);
    },

    load: function (options) {
        this.fill(new Config(options).get());
        this._setupOptions();
    },

    fill: function (options) {
        this._config.merge(options || {});
    }

}

for (var i in config)
    Config.prototype[i] = config[i];

module.exports = Config;