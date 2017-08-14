#! /usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const EnvUtil = require('./EnvUtil');

checkArgs();
const envUtil = new EnvUtil(argv.bucket, argv.key);
envUtil.getEnvVariables()
  .then(envUtil.writeToDotEnv);

function checkArgs() {
  if (!argv.bucket && !argv.key) {
    throw new Error('No bucket or key passed');
  }

  if (!argv.bucket) {
    throw new Error('No bucket passed');
  }

  if (!argv.key) {
    throw new Error('No key passed');
  }
}
