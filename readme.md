# Invoke AWS Lambda

This action allows you to invoke a lambda function and get the response (if desired)

## Inputs

### `AWS CREDENTIALS`

**Required** aws credentials`.

## Outputs

### `response`

the response from the lambda invocation

## Example usage

```yaml
uses: gagoar/invoke-aws-lambda@v2
with:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  FunctionName: SomeFunction
  LogType: None
  Payload: '{"someInput": "value"}'
  Qualifier: someAlias
```
