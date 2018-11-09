Feature: Config

  Background:
    Given code:
    """
    ```

        var __dirname = process.cwd();

        var Config = require(__dirname + '/src/Config');

        var config = new Config({
            dir: __dirname + '/test/config'
        });

    ```
    """

  Scenario: Should load config.json
    Given code `var name = config.get('name')`
    Then `name` should equal 'value'

  Scenario: should define default environment as `dev`
    Given code `var env = config.get('env');`
    Then `env` should equal 'dev'

