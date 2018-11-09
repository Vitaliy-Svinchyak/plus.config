describe('Config', function () {

    require('chai').should();
    var config, Config = require('../src/Config');

    function createConfig() {
        return new Config({
            dir: __dirname + '/config'
        });
    }


    it('should be constructed with a dir', function () {
        var config = createConfig();
    })

    it('should define default environment as `dev`', function () {
        var config = createConfig();
        config.get('env').should.equal('dev');
    })

    it('should allow to define custom environment', function () {
        var config = new Config({
            dir: __dirname + '/config',
            env: 'test'
        });
        config.get('env').should.equal('test');
    })

    it('should load config.json an allow to get value', function () {
        var config = createConfig();
        config.get('name').should.equal('value');
    })

    it('should load config_[env].json an allow to get value', function () {
        var config = createConfig();
        config.get('dev_name').should.equal('dev_value');
    })

    it('should load config_[env].json and override environment dependend options', function () {
        var config = createConfig();
        config.get('env_dependent_name').should.equal('dev_value');
    })

    it('should load parameters.json and override options', function () {
        var config = createConfig();
        config.get('parameter').should.equal('parameters_value');
    })

    it('should allow to override options', function () {
        var config = new Config({
            dir: __dirname + '/config',
            env: 'test',
            options: {name: 'myValue'}
        });
        config.get('name').should.equal('myValue');
    })

    it('should support env variable NODE_CONFIG and overrides config', function () {

        var customValue = 'myValue';
        process.env.NODE_CONFIG__name = customValue;

        var config = new Config({
            dir: __dirname + '/config',
            env: 'test'
        });

        var expected = {name: customValue};
        expected.should.deep.equal( config.get('NODE_CONFIG') );

        customValue.should.equal(config.get('name'));
    })

    it('should allow to override options via NODE_CONFIG', function () {

        process.env.NODE_CONFIG__name = 'myValue3';
        var config = new Config({
            dir: __dirname + '/config',
            env: 'test',
            options: {name: 'myValue', name2: 'myValue2'}
        });

        'myValue3'.should.equal(config.get('name'));
        'myValue2'.should.equal( config.get('name2'));
    })


    it('should allow to set value', function () {

        var config = new Config();

        (config.get('name1') === undefined).should.be.true;

        config.set('name1', 'value');
        config.get('name1').should.equal('value');
    })

    it('should allow to load configs from different dirs', function () {

        var config = new Config({
            dir: [__dirname + '/config1']
        });

        config.get('name1').should.equal('value1');
        config.get('name2').should.equal('value2');

        var config = new Config({
            dir: [__dirname + '/config1', __dirname + '/config1.1']
        });

        config.get('name1').should.equal('value1.1');
        config.get('name2').should.equal('value2');


    })

    it('should allow to load from the custom dir config.load()', function () {

        var config = new Config({
            dir: __dirname + '/config2'
        });

        config.get('name1').should.equal('value1');
        config.get('name2').should.equal('value2');
        config.get('name3.name3_1').should.equal('value3.1');
        config.get('name3.name3_2').should.equal('value3.2');

        config.load({dir: __dirname + '/config2/custom'});

        config.get('name1').should.equal('value1');
        config.get('name2').should.equal('value2.custom');

        config.get('name3.name3_1').should.equal('value3.1');
        config.get('name3.name3_2').should.equal('value3.2.custom');

    })

    it('should allow to fill options', function () {
        var config = createConfig();
        config.get('env').should.equal('dev');
        config.fill({env: 'zzzz'});
        config.get('env').should.equal('zzzz');
    })

    it('should support npm config style with environment', function () {

        var config = new Config({
            dir: __dirname + '/config.npm.config',
            env: 'development'
        });

        config.get('xxx').should.equal('xxx1');
        config.get('yyy').should.equal('yyy-development');
        config.get('db:debug').should.equal(true);

        config.get('db').should.deep.equal({
                "debug": true,
                "uri": "xxxx://xxx:yyy@xxx.com/db"
            }
        );


    })

    it('should support npm config from multiple dirs', function () {

        var config = new Config({
            dir: __dirname + '/npm.config/1',
            env: 'development'
        });

        config.get('db.a1').should.equal(1.1);
        config.get('db.default').should.equal('a');
        config.get('db.dev').should.equal('b');

        var config = new Config({
            dir: [__dirname + '/npm.config/1', __dirname + '/npm.config/2'],
            env: 'development'
        });

        config.get('db.a1').should.equal(2);
        config.get('db.default').should.equal('a');
        config.get('db.dev').should.equal('config 2');

    })
})