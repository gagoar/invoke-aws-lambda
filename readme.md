<p align="center">
    <a href="https://github.com/marketplace/actions/invoke-aws-lambda">
      <img src="https://img.shields.io/badge/Marketplace-v3-undefined.svg?logo=github&logoColor=white&style=flat" alt="GitHub Marketplace" />
    </a>
    <a href="https://github.com/gagoar/invoke-aws-lambda/actions">
      <img src="https://github.com/gagoar/invoke-aws-lambda/workflows/validation/badge.svg" alt="Workflow" />
    </a>
    <a href="https://codecov.io/gh/gagoar/invoke-aws-lambda">
      <img src="https://codecov.io/gh/gagoar/invoke-aws-lambda/branch/master/graph/badge.svg?token=48gHuQl8zV" alt="codecov" />
    </a>
    <a href="https://github.com/gagoar/alohomora/blob/master/LICENSE">
      <img src="https://img.shields.io/npm/l/alohomora.svg?style=flat-square" alt="MIT license" />
    </a>
</p>

# Invoke AWS Lambda

This action allows you to synchronously invoke a Lambda function and get the response (if desired).

## Table of contents

  - [Input parameters](#input-parameters)
    - [Credentials](#credentials)
    - [Invocation](#invocation)
  - [Output](#output)
  - [Examples](#examples)
    - [Basic example](#basic-example)
    - [Using output](#using-output)
    - [Specifying alias/version](#specifying-aliasversion)
    - [Handling logs](#handling-logs)

<hr>

## Input parameters

### Credentials

| Key                     | Type     | Description                                                                                                                                                                                                              |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AWS_ACCESS_KEY_ID`     | `string` | Access Key ID (must be used with `AWS_SECRET_ACCESS_KEY`) - [AWS Security Credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) reference               |
| `AWS_SECRET_ACCESS_KEY` | `string` | Secret Access Key (must be used with `AWS_ACCESS_KEY_ID`) - [AWS Security Credentials](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys) reference               |
| `AWS_SESSION_TOKEN`     | `string` | Session Token (can be used in place of `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) - [AWS Temporary Credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_use-resources.html) reference |

### Invocation

| Key              | Type/Possible Values               | Description                                                                                                                          |
| ---------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `FunctionName`   | `string`                           | Name of the Lambda function to be invoked                                                                                            |
| `InvocationType` | `RequestResponse \| Event \| DryRun` | See the [AWS Javascript SDK docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#invoke-property) for more info |
| `LogType`        | `Tail \| None`                      | Set to `Tail` to include the execution log in the response                                                                           |
| `Payload`        | `string`                           | JSON that you want to provide to your Lambda function as input                                                                       |
| `Qualifier`      | `string`                           | Version or alias of the function to be invoked                                                                                       |
| `ClientContext`  | `string`                           | Base64-encoded data about the invoking client to pass to the function                                                                |

For more details on the parameters accepted by `Lambda.invoke()`, see the [AWS Javascript SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#invoke-property) docs

<hr>

## Output

This step will store the JSON response from the Lambda function invocation in `outputs.response`, with the following properties:

| Property          | Type      | Description                                                                         |
| ----------------- | --------- | ----------------------------------------------------------------------------------- |
| `StatusCode`      | `integer` | HTTP status code - 200 if successful                                                |
| `ExecutedVersion` | `string`  | Version or alias of function that was executed                                      |
| `Payload`         | `string`  | JSON returned by the function invocation, or error object                           |
| `LogResult`       | `string`  | Base64-encoded last 4KB of execution log, if `LogType` was set to `Tail`            |
| `FunctionError`   | `string`  | If present, indicates that an error has occured, with more information in `Payload` |

Note that you will have to parse the output using the `fromJSON` [function](https://help.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#functions) before accessing individual properties.  
See the [Using Output](#Using-Output) example for more details.

<hr>

## Examples

### Basic example

This step invokes a Lambda function without regard for the invocation output:

```yaml
- name: Invoke foobarFunction Lambda
  uses: gagoar/invoke-aws-lambda@v3
  with:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    FunctionName: foobarFunction
    Payload: '{ "myParameter": false }'
```

### Using output

These steps process the response payload by using step outputs:

```yaml
- name: Invoke foobarFunction Lambda
  id: foobar
  uses: gagoar/invoke-aws-lambda@v3
  with:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    FunctionName: foobarFunction
    Payload: '{ "myParameter": false }'
- name: Store response payload to file
  run: echo "${{ fromJSON(steps.foobar.outputs.response).Payload }}" > invocation-response.json
```

Notice the addition of the `id` field to the invocation step.  
For more information for Github Actions outputs, see their [reference](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjobs_idoutputs).

### Specifying alias/version

This step invokes a Lambda function with the `someAlias` alias:

```yaml
- name: Invoke foobarFunction Lambda
  uses: gagoar/invoke-aws-lambda@v3
  with:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    FunctionName: foobarFunction
    Payload: '{ "myParameter": false }'
    Qualifier: someAlias
```

Similarly, if we wanted to invoke version 53 in particular, we would use:

```yaml
...
  with:
    ...
    Qualifier: 53
```

### Handling logs

These steps process logs returned from the invocation:

```yaml
- name: Invoke foobarFunction Lambda
  id: foobar
  uses: gagoar/invoke-aws-lambda@v3
  with:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    FunctionName: foobarFunction
    LogType: Tail
    Payload: '{ "myParameter": false }'
- name: Store tail logs to file
  run: echo "${{ fromJSON(steps.foobar.outputs.response).LogResult }}" > invocation-logs.json
```