const merge = require('merge')

class Config {

    constructor (options) {
        this.dir = options.dir
        this.env = options.env
        this._load()
    }

    _load () {
        const defaultConfig = require(this.dir + '/default.js')
        const envConfig = require(this.dir + `/${this.env}.js`)
        this.config = merge(defaultConfig, envConfig)
    }

    get (name) {
        const path = name.split(':')
        let value = this.config

        for (let key of path) {
            value = value[key]
        }

        return value
    }

    set (name, value) {
        const path = name.split(':')
        let currentValue = this.config

        for (let i = 0; path.length > 1 && i < path.length; i++) {
            currentValue = currentValue[path[i]]
            if (i === path.length - 2) {
                break
            }
        }
        currentValue[path.pop()] = value
    }

    fill (options) {
        this.config = merge(this.config, options || {})
    }

}

module.exports = Config
