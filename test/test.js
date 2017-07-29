require('dotenv').config();


describe("etuovi", function () {
  this.timeout(10000);
  describe("run as module", function () {
    it("should scan using example config", function () {
      const index = require("../index");
      index.logLevel('warn');
      return index.scan('example-config.json');
    });
  });
  describe("test outputs", function () {
    it("should output a report to slack", function () {
      const masterReport = require("./etuovi__scan__report.json");
      return require("../lib/outputs/slack").output(masterReport, {
        slackWebhook: process.env.SLACK_WEBHOOK
      });
    });
  });
});