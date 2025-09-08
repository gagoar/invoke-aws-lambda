import { main, Props, Credentials, ExtraOptions } from '../src';
import { setFailed, getInput, setOutput, setSecret } from '../__mocks__/@actions/core';
import { LambdaClient, constructorMock, sendMock } from '../__mocks__/@aws-sdk/client-lambda';

describe('invoke-aws-lambda', () => {
  const mockedInput = {
    [Props.FunctionName]: 'SomeFunction',
    [Props.InvocationType]: 'RequestResponse',
    [Props.LogType]: 'None',
    [Props.ClientContext]: '{}',
    [Props.Payload]: '{"input": {value: "1"}',
    [Props.Qualifier]: 'production',
    [ExtraOptions.HTTP_TIMEOUT]: '220000',
    [ExtraOptions.MAX_RETRIES]: '3',
    [ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE]: 'false',
    [Credentials.AWS_ACCESS_KEY_ID]: 'someAccessKey',
    [Credentials.AWS_SECRET_ACCESS_KEY]: 'someSecretKey',
    REGION: 'us-west-2',
  };

  beforeAll(() => {
    getInput.mockImplementation((key: Partial<Props & Credentials & 'REGION'>) => {
      return mockedInput[key];
    });
  });

  afterEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
    setSecret.mockClear();
    constructorMock.mockClear();
    sendMock.mockClear();
  });

  it('runs when provided the correct input', async () => {
    const handler = jest.fn(() => Promise.resolve({ response: 'ok' }));

    LambdaClient.__setResponseForMethods({ send: handler });

    await main();
    expect(getInput).toHaveBeenCalledTimes(13);
    expect(setFailed).not.toHaveBeenCalled();
    expect(setSecret).toHaveBeenCalledTimes(2);
    expect(constructorMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "credentials": Object {
              "accessKeyId": "someAccessKey",
              "secretAccessKey": "someSecretKey",
              "sessionToken": undefined,
            },
            "maxAttempts": 3,
            "region": "us-west-2",
            "requestHandler": Object {
              "httpOptions": Object {
                "timeout": 220000,
              },
            },
          },
        ],
      ]
    `);
    expect(handler.mock.calls).toHaveLength(1);
    expect(setOutput.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "response",
          Object {
            "response": "ok",
          },
        ],
      ]
    `);
  });

  it('fails when lambda invocation throws an error', async () => {
    const handler = jest.fn(() => Promise.reject(new Error('something went horribly wrong')));

    LambdaClient.__setResponseForMethods({ send: handler });

    await main();

    expect(getInput).toHaveBeenCalledTimes(12);
    expect(setFailed).toHaveBeenCalled();
    expect(setOutput).not.toHaveBeenCalled();
    expect(setSecret).toHaveBeenCalledTimes(2);
  });

  describe('when the function returns an error', () => {
    beforeEach(() => {
      const handler = jest.fn().mockResolvedValue({
        FunctionError: 'Unhandled',
      });

      LambdaClient.__setResponseForMethods({ send: handler });
    });

    it('should fail the action when SUCCEED_ON_FUNCTION_FAILURE is undefined', async () => {
      const overriddenMockedInput = {
        ...mockedInput,
        [ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE]: undefined,
      };

      getInput.mockImplementation((key: Partial<Props & Credentials & 'REGION'>) => {
        return overriddenMockedInput[key];
      });

      await main();

      expect(setOutput).toHaveBeenCalled();
      expect(setFailed).toHaveBeenCalled();
      expect(setSecret).toHaveBeenCalledTimes(2);
    });

    it('should fail the action when SUCCEED_ON_FUNCTION_FAILURE is false', async () => {
      const overriddenMockedInput = {
        ...mockedInput,
        [ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE]: 'false',
      };

      getInput.mockImplementation((key: Partial<Props & Credentials & 'REGION'>) => {
        return overriddenMockedInput[key];
      });

      await main();

      expect(setOutput).toHaveBeenCalled();
      expect(setFailed).toHaveBeenCalled();
      expect(setSecret).toHaveBeenCalledTimes(2);
    });

    it('should succeed the action when SUCCEED_ON_FUNCTION_FAILURE is true', async () => {
      const overriddenMockedInput = {
        ...mockedInput,
        [ExtraOptions.SUCCEED_ON_FUNCTION_FAILURE]: 'true',
      };

      getInput.mockImplementation((key: Partial<Props & Credentials & 'REGION'>) => {
        return overriddenMockedInput[key];
      });

      await main();

      expect(setOutput).toHaveBeenCalled();
      expect(setFailed).not.toHaveBeenCalled();
      expect(setSecret).toHaveBeenCalledTimes(2);
    });

    it("should call setSecret on AWS_SESSION_TOKEN when it's provided", async () => {
      const overriddenMockedInput = {
        ...mockedInput,
        [Credentials.AWS_SESSION_TOKEN]: 'someSessionToken',
      };

      getInput.mockImplementation((key: Partial<Props & Credentials & 'REGION'>) => {
        return overriddenMockedInput[key];
      });

      const handler = jest.fn(() => Promise.resolve({ response: 'ok' }));

      LambdaClient.__setResponseForMethods({ send: handler });

      await main();

      expect(getInput).toHaveBeenCalledTimes(13);
      expect(setFailed).not.toHaveBeenCalled();
      expect(setSecret).toHaveBeenCalledTimes(3);
    });
  });
});
