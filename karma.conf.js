// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const path = require('path');

module.exports = function (config) {
  const isCi = process.env.CI === 'true' || process.env.TEST_CI === 'true';

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // Global timeout for every unit test (ms)
        timeoutInterval: 60000,
        random: false,
        stopSpecOnExpectationFailure: false,
        failSpecWithNoExpectations: false,
      },
      clearContext: false,
      captureConsole: true,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: path.join(__dirname, './coverage'),
      subdir: '.',
      // Do not omit unloaded sources from the contract check script
      includeAllSources: true,
      reporters: [
        { type: 'html' },
        { type: 'text' },
        { type: 'text-summary' },
        { type: 'lcovonly' },
        { type: 'json' },
        { type: 'json-summary' },
        { type: 'cobertura' },
      ],
    },
    reporters: isCi
      ? ['progress', 'coverage', 'junit']
      : ['progress', 'kjhtml', 'coverage'],
    junitReporter: {
      outputDir: path.join(__dirname, './coverage/junit'),
      outputFile: 'test-results.xml',
      useBrowserName: false,
      nameFormatter: undefined,
      classNameFormatter: undefined,
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: !isCi,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
        ],
      },
    },
    singleRun: isCi,
    restartOnFileChange: !isCi,
    browserNoActivityTimeout: 300000,
    browserDisconnectTimeout: 300000,
    browserDisconnectTolerance: 5,
    captureTimeout: 300000,
    failOnEmptyTestSuite: false,
  });
};
