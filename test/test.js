/* eslint-disable no-undef, no-unused-expressions */
const { expect } = require('chai');
const { stub } = require('sinon');
const EnvUtil = require('../EnvUtil');
const fs = require('fs');

describe('EnvUtil', () => {
  it('should exist', () => {
    expect(EnvUtil).to.exist;
  });

  it('should create instances', () => {
    const envUtil = new EnvUtil('somebucket', 'somekey');
    expect(envUtil).to.be.an.instanceof(EnvUtil);
  });
});

describe('EnvUtil.getEnvVariables method', () => {
  it('should exist', () => {
    const envUtil = new EnvUtil('somebucket', 'somekey');
    expect(envUtil.getEnvVariables).to.be.exist;
    expect(envUtil.getEnvVariables).to.be.a('function');
  });

  it('should call `s3.getObject`', () => {
    const envUtil = new EnvUtil('somebucket', 'somekey');
    stub(envUtil.s3, 'getObject');

    envUtil.getEnvVariables();
    expect(envUtil.s3.getObject.called).to.be.true;
  });

  it('should throw when not given a bucket or key', () => {
    const envUtil = new EnvUtil();
    stub(envUtil.s3, 'getObject').onFirstCall().throws();

    expect(envUtil.getEnvVariables).to.throw();
  });

  it('should throw when given a non existent bucket', () => {
    const envUtil = new EnvUtil('nonexistentbucket', 'somekey');
    stub(envUtil.s3, 'getObject').onFirstCall().throws();

    expect(envUtil.getEnvVariables).to.throw();
  });

  it('should throw when given a non existent key', () => {
    const envUtil = new EnvUtil('somebucket', 'nonexistentkey');
    stub(envUtil.s3, 'getObject').onFirstCall().throws();

    expect(envUtil.getEnvVariables).to.throw();
  });
});

describe('EnvUtil.writeToDotEnv method', () => {
  const envFile = 'KEY=VALUE';
  const stubbedWriteFile = stub(fs, 'writeFile');

  it('should exist', () => {
    const envUtil = new EnvUtil('somebucket', 'somekey');
    expect(envUtil.writeToDotEnv).to.be.exist;
    expect(envUtil.writeToDotEnv).to.be.a('function');
  });

  it('should call `fs.writeFile`', () => {
    const envUtil = new EnvUtil('somebucket', 'somekey');

    envUtil.writeToDotEnv(envFile);
    expect(fs.writeFile.called).to.be.true;
  });

  it('should throw when not passed contents to write', () => {
    const envUtil = new EnvUtil('somebucket', 'somekey');

    stubbedWriteFile.withArgs('./.env').throws();
    stubbedWriteFile.withArgs('./.env', envFile).returns('ok');

    expect(envUtil.writeToDotEnv).to.throw();
    expect(() => { envUtil.writeToDotEnv(envFile); }).to.not.throw();
  });
});

