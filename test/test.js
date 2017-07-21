require('dotenv').config()

const assert = require("assert");

const masterReport = require("./etuovi__scan__report.json");

describe("etuovi", function () {
  describe("slack", function () {
    it("should send a report to slack", function () {
      return require("../lib/outputs/slack").output(masterReport, {
        slackWebhook: process.env.SLACK_WEBHOOK
      });
    });
  });
});