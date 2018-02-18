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
            // TODO pagination
            s3.listBuckets(params, (err, data) => {
                if (err) return reject(err);
                return Promise.all(
                    _.map(data.Buckets, bucket => {
                        const params = {
                            Bucket: bucket.Name
                        };
                        s3.getBucketAcl(params, (err, data) => {
                            if (err) return reject(err);
                            console.log(bucket.Name + JSON.stringify(data, null, 4));
                        });
                    })
                );
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
