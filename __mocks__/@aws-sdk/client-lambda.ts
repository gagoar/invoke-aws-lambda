/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LambdaClientConfig } from '@aws-sdk/client-lambda';

type LAMBDAMOCKS = {
  send?: (command: any) => Promise<any>;
};

let lambdaMocks = {} as LAMBDAMOCKS;

export const constructorMock = jest.fn();
export const sendMock = jest.fn();

export class LambdaClient {
  static __setResponseForMethods(mock: LAMBDAMOCKS) {
    lambdaMocks = { ...lambdaMocks, ...mock };
  }

  static __showMockedPayloads() {
    return { ...lambdaMocks };
  }

  constructor(props: LambdaClientConfig) {
    constructorMock(props);
  }

  async send(command: any) {
    sendMock(command);
    if (lambdaMocks.send) {
      return lambdaMocks.send(command);
    }
    return {};
  }
}

export class InvokeCommand {
  constructor(public input: any) {}
}
