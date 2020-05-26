import AWS from 'aws-sdk/global';
import Lambda from 'aws-sdk/clients/lambda';
import { getInput, setOutput, setFailed } from '@actions/core';

const apiVersion = '2015-03-31';

export enum Credentials {
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
  AWS_SESSION_TOKEN = 'AWS_SESSION_TOKEN'
};

export enum Props {
  FunctionName = 'FunctionName',
  InvocationType = 'InvocationType',
  LogType = 'LogType',
  ClientContext = 'ClientContext',
  Payload = 'Payload',
  Qualifier = 'Qualifier'
};

const setAWSCredentials = () => {
  AWS.config.credentials = {
    accessKeyId: getInput(Credentials.AWS_ACCESS_KEY_ID),
    secretAccessKey: getInput(Credentials.AWS_SECRET_ACCESS_KEY),
    sessionToken: getInput(Credentials.AWS_SESSION_TOKEN)
  };
};

const getParams = () => {
  return Object.keys(Props).reduce((memo, prop) => {
    const value = getInput(prop);
    return value ? { ...memo, [prop]: value } : memo;
  }, {} as Lambda.InvocationRequest);
};

export const main = async () => {
  try {

    setAWSCredentials();

    const params = getParams();

    const lambda = new Lambda({ apiVersion, region: getInput('REGION') });

    const response = await lambda.invoke(params).promise();

    setOutput('response', response);

  } catch (error) {
    setFailed(error.message);
  }
};