import { LambdaClient, InvokeCommand, InvokeCommandInput } from '@aws-sdk/client-lambda';
import { getInput, setOutput, setFailed, setSecret } from '@actions/core';

export enum ExtraOptions {
  HTTP_TIMEOUT = 'HTTP_TIMEOUT',
  MAX_RETRIES = 'MAX_RETRIES',
  SUCCEED_ON_FUNCTION_FAILURE = 'SUCCEED_ON_FUNCTION_FAILURE',
}

export enum Credentials {
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
  AWS_SESSION_TOKEN = 'AWS_SESSION_TOKEN',
}

export enum Props {
  FunctionName = 'FunctionName',
  InvocationType = 'InvocationType',
  LogType = 'LogType',
  ClientContext = 'ClientContext',
  Payload = 'Payload',
  Qualifier = 'Qualifier',
}

const getAWSCredentials = () => {
  const accessKeyId = getInput(Credentials.AWS_ACCESS_KEY_ID);
  setSecret(accessKeyId);

  const secretAccessKey = getInput(Credentials.AWS_SECRET_ACCESS_KEY);
  setSecret(secretAccessKey);

  const sessionToken = getInput(Credentials.AWS_SESSION_TOKEN);
  // Make sure we only mask if specified
  if (sessionToken) {
    setSecret(sessionToken);
  }

  return {
    accessKeyId,
    secretAccessKey,
    sessionToken,
  };
};

const getParams = (): InvokeCommandInput => {
  return Object.keys(Props).reduce((memo, prop) => {
    const value = getInput(prop);
    return value ? { ...memo, [prop]: value } : memo;
  }, {} as InvokeCommandInput);
};

const getAWSConfigOptions = () => {
  const httpTimeout = getInput(ExtraOptions.HTTP_TIMEOUT);
  const maxRetries = getInput(ExtraOptions.MAX_RETRIES);

  const config: any = {};

  if (httpTimeout) {
    config.requestHandler = {
      httpOptions: { timeout: parseInt(httpTimeout, 10) },
    };
  }

  if (maxRetries) {
    config.maxAttempts = parseInt(maxRetries, 10);
  }

  return config;
};

export const main = async () => {
  try {
    const credentials = getAWSCredentials();
    const configOptions = getAWSConfigOptions();
    const params = getParams();

    const lambda = new LambdaClient({
      region: getInput('REGION'),
      credentials,
      ...configOptions,
    });

    const command = new InvokeCommand(params);
    const response = await lambda.send(command);

    setOutput('response', response);

    const succeedOnFailure = getInput(ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE).toLowerCase() === 'true';
    if ('FunctionError' in response && !succeedOnFailure) {
      throw new Error('Lambda invocation failed! See outputs.response for more information.');
    }
  } catch (error) {
    setFailed(error instanceof Error ? error.message : JSON.stringify(error));
  }
};
