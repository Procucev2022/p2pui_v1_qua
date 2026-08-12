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
      // Fail Karma when any file (or the aggregate) is under 90%
      check: {
        emitWarning: false,
        global: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
        each: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
      },
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
    browserNoActivityTimeout: 120000,
    browserDisconnectTimeout: 120000,
    browserDisconnectTolerance: 2,
    captureTimeout: 180000,
  });
};
