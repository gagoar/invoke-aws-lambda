# Integration Test Setup Guide

This guide explains how to set up and run the integration tests for the `invoke-aws-lambda` GitHub Action.

## Prerequisites

1. **AWS Account**: You need an active AWS account with appropriate permissions
2. **AWS Lambda Function**: A test Lambda function to invoke
3. **GitHub Repository**: This action must be in a GitHub repository

## AWS Setup

### 1. Create a Test Lambda Function

Create a simple Lambda function for testing:

```python
import json

def lambda_handler(event, context):
    """
    Simple test Lambda function that returns the input event
    """
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Hello from Lambda!',
            'input': event,
            'timestamp': context.aws_request_id
        })
    }
```

Or using Node.js:

```javascript
exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from Lambda!',
            input: event,
            timestamp: context.awsRequestId
        })
    };
};
```

### 2. Create IAM User/Role

Create an IAM user or role with the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": "arn:aws:lambda:*:*:function:YOUR_TEST_FUNCTION_NAME"
        }
    ]
}
```

## GitHub Configuration

### 1. Repository Secrets

Add the following secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_SESSION_TOKEN`: (Optional) If using temporary credentials

**To add secrets:**
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the appropriate value

### 2. Repository Variables

Add the following variables to your GitHub repository:

- `AWS_REGION`: Your AWS region (e.g., `us-east-1`, `us-west-2`)
- `TEST_LAMBDA_FUNCTION_NAME`: Name of your test Lambda function
- `LAMBDA_QUALIFIER`: (Optional) Lambda version/alias (default: `LATEST`)

**To add variables:**
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click on "Variables" tab
5. Click "New repository variable"
6. Add each variable with the appropriate value

## Running the Tests

### 1. Automatic Triggers

The integration tests will run automatically when:
- You push changes to the `dist/` directory
- You create a pull request that modifies the `dist/` directory
- You push to `main` or `master` branch

### 2. Manual Trigger

You can also run the tests manually:

1. Go to the "Actions" tab in your GitHub repository
2. Select "Integration Test with AWS Lambda" workflow
3. Click "Run workflow"
4. Fill in the optional inputs:
   - `test_function_name`: Override the test function name
   - `test_payload`: Custom payload to send to Lambda

## Test Scenarios

The integration test runs three scenarios:

### 1. Success Case
- Invokes your test Lambda function with a valid payload
- Expects the action to succeed
- Displays the Lambda response

### 2. Error Case
- Attempts to invoke a non-existent Lambda function
- Expects the action to fail (error handling test)
- Verifies proper error handling

### 3. Success on Failure Case
- Attempts to invoke a non-existent Lambda function
- Sets `SUCCEED_ON_FUNCTION_FAILURE=true`
- Expects the action to succeed despite the error

## Configuration Placeholders

Replace these placeholders in the workflow file:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `YOUR_TEST_FUNCTION_NAME` | Name of your test Lambda function | `my-test-function` |
| `us-east-1` | Your preferred AWS region | `us-west-2` |
| `LATEST` | Lambda version/alias | `$LATEST` or `production` |

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure your AWS credentials have `lambda:InvokeFunction` permission
   - Check that the function name is correct

2. **Function Not Found**
   - Verify the function name in your repository variables
   - Ensure the function exists in the specified region

3. **Timeout Issues**
   - Increase `HTTP_TIMEOUT` value if your Lambda function takes longer to execute
   - Check your Lambda function's timeout settings

4. **Invalid Credentials**
   - Verify your AWS secrets are correctly set in GitHub
   - Ensure the credentials are not expired

### Debugging

To debug issues:

1. Check the workflow logs in the "Actions" tab
2. Look for error messages in the "Display Lambda Response" step
3. Verify your AWS credentials and permissions
4. Test your Lambda function directly in the AWS Console

## Security Notes

- Never commit AWS credentials to your repository
- Use GitHub Secrets for sensitive information
- Consider using IAM roles instead of access keys when possible
- Regularly rotate your AWS credentials
- Use least-privilege permissions for your IAM user/role

## Example Test Function

Here's a more comprehensive test Lambda function:

```python
import json
import time
from datetime import datetime

def lambda_handler(event, context):
    """
    Comprehensive test Lambda function
    """
    start_time = time.time()
    
    # Simulate some processing
    time.sleep(0.1)
    
    response = {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Integration test successful!',
            'input': event,
            'metadata': {
                'functionName': context.function_name,
                'functionVersion': context.function_version,
                'requestId': context.aws_request_id,
                'timestamp': datetime.utcnow().isoformat(),
                'executionTime': round((time.time() - start_time) * 1000, 2)
            }
        })
    }
    
    return response
```

This function provides more detailed information for testing and debugging.
