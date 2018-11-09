# plus.config - configuration with environment

This config based on `nconf` and `config` packages and loads configuration from folder.
It has 2 parameters `dir` and `env`.

## Loading environment

### Dir structure

```
|-- config.json
|-- config_dev.json
|-- config_test.json
|-- config_prod.json
`-- parameters.json
```

```

    var Config = require('plus.config');

    var config = new Config({
        dir: __dirname,
        env: process.env.NODE_ENV || 'dev'
    });

    config.get('var-name')
    config.get('deep.to.var-name')

```

This code loads `config.json` overrides variables with `config_dev.json` and overrides variables `parameters.json`.
It works recursively.

It loads:

- `config.json`  // common settings
- `config_dev.json` // environment settings
- `parameters.json` // custom settings for local environment


## Using

`NODE_ENV=test node app.js`

if you use `test` environment it will loads files in this order:

- `config.json`  // common settings
- `config_test.json` // environment settings
- `parameters.json` // custom settings for local environment

## Config support

Now plus.config supports files in this format to this based on `config` package
https://www.npmjs.com/package/config


```
default.EXT
default-{instance}.EXT
{deployment}.EXT
{deployment}-{instance}.EXT
{short_hostname}.EXT
{short_hostname}-{instance}.EXT
{short_hostname}-{deployment}.EXT
{short_hostname}-{deployment}-{instance}.EXT
{full_hostname}.EXT
{full_hostname}-{instance}.EXT
{full_hostname}-{deployment}.EXT
{full_hostname}-{deployment}-{instance}.EXT
local.EXT
local-{instance}.EXT
local-{deployment}.EXT
local-{deployment}-{instance}.EXT
```