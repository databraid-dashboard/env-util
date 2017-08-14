const fs = require('fs');
const { S3 } = require('aws-sdk');

class EnvUtil {
  constructor(bucket, key) {
    this.bucket = bucket;
    this.key = key;
    this.s3 = new S3();
  }

  getEnvVariables() {
    const params = {
      Bucket: this.bucket,
      Key: this.key,
    };

    return new Promise((resolve, reject) => {
      this.s3.getObject(params, (err, data) => {
        if (err) {
          reject(new Error(`There was an error retrieving ${params.Bucket}/${params.key}: ${err}`));
        } else {
          resolve(data.Body.toString().trim());
        }
      });
    });
  }

  /* eslint-disable class-methods-use-this */
  writeToDotEnv(envVariables) {
    fs.writeFile('./.env', envVariables, (err) => {
      if (err) {
        throw new Error(`There was an error when writing to .env: ${err}`);
      }
    });
  }
}

const envUtil = new EnvUtil('db-open', 'openfile.env');

envUtil.getEnvVariables()
  .then(envUtil.writeToDotEnv)
  .catch(handleError);

function handleError(err) {
  throw new Error(err);
}

module.exports = EnvUtil;
