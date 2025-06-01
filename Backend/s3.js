const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: "AKIAWX2IFPZYF2O4O3FG", 
  secretAccessKey: "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",
  region: us-east-1, 
});

const s3 = new AWS.S3();
module.exports = s3;
