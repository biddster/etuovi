const assert = require("assert");

const masterReport = require("./etuovi__scan__report.json");

describe("etuovi", function() {
  describe("slack", function() {
    it("should send a report to slack", function() {
      return require("../lib/outputs/slack").output(masterReport, {
        slackWebhook: "https://hooks.slack.com/services/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"
      });
    });
  });
});
