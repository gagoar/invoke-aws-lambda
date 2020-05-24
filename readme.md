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
