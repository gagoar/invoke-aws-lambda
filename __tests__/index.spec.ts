import { main, Props, Credentials } from '../src';
import { setFailed, getInput, setOutput } from '../__mocks__/@actions/core';
import Lambda, { constructorMock } from '../__mocks__/aws-sdk/clients/lambda';

describe('invoke-aws-lambda', () => {
  const mockedInput = {
    [Props.FunctionName]: 'SomeFunction',
    [Props.LogType]: 'None',
    [Props.Payload]: '{"input": {value: "1"}',
    [Props.Qualifier]: 'production',
    [Credentials.AWS_ACCESS_KEY_ID]: 'someAccessKey',
    [Credentials.AWS_SECRET_ACCESS_KEY]: 'someSecretKey',
    REGION: 'us-west-2',
  };


  getInput.mockImplementation(
    (key: Partial<Props & Credentials & 'REGION'>) => {
      return mockedInput[key];
    }
  );

  afterEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
  });

  it('runs when provided the correct input', async () => {

    const handler = jest.fn(() => ({ response: 'ok' }));

    Lambda.__setResponseForMethods({ invoke: handler });

    await main();
    expect(getInput).toHaveBeenCalledTimes(10);
    expect(setFailed).not.toHaveBeenCalled();
    expect(constructorMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "apiVersion": "2015-03-31",
            "region": "us-west-2",
          },
        ],
      ]
    `);
    expect(handler.mock.calls).toMatchInlineSnapshot(
      `
      Array [
        Array [
          Object {
            "FunctionName": "SomeFunction",
            "LogType": "None",
            "Payload": "{\\"input\\": {value: \\"1\\"}",
            "Qualifier": "production",
          },
        ],
      ]
    `
    );
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

  it('fails when lambda throws an error', async () => {
    const handler = jest.fn(() => { throw new Error('something went horribly wrong') });
    Lambda.__setResponseForMethods({ invoke: handler });

    await main();
    expect(getInput).toHaveBeenCalledTimes(10);
    expect(setFailed).toHaveBeenCalled();
    expect(setOutput).not.toHaveBeenCalled();
  });

});

