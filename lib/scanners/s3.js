const l = require('winston');
const Promise = require('bluebird');
const _ = require('lodash');
const AWS = require('aws-sdk');

module.exports = {
    scan(host, config) {
        return new Promise((resolve, reject) => {
            if (!config.credentialsProfile) {
                return reject(new Error('S3 configuration must specify credentialsProfile'));
            }
            AWS.config.credentials = new AWS.SharedIniFileCredentials({
                profile: config.credentialsProfile
            });
            const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
            const params = {};
            s3.listBuckets(params, function(err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        });
    },
    newConfig() {
        return {
            credentialsProfile: 'name of section in ~/.aws/.credentials',
            awsAccessKeyId: 'TODO - support this',
            awsSecretAccessKey: 'TODO - support this',
            expect: [
                {
                    bucket: 'example-bucket',
                    exposure: 'private'
                }
            ]
        };
    }
};
