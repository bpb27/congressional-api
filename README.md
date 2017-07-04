### Setup and Deployment Notes

## Setup
1) `npm install -g serverless`
2) `npm install`
3) You'll have to configure you're own DynamoDB and add your ARN in serverless.yaml

## Basic Config:
1) SERVICE NAME: serverless-api
2) REGION: us-east-1
3) STAGE: dev
4) RUNTIME: nodejs6.10

## AWS Services used:
1) S3 for versioning
  a) https://console.aws.amazon.com/s3/home?region=us-east-1
  b) S3 is no longer region specific, just a single dashboard
2) Lambda for functions
  a) https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1
  b) deployed functions named service-staging-function
3) API Gateway for HTTP events
  a) https://us-east-1.console.aws.amazon.com/apigateway/home?region=us-east-1
4) CloudFormation for the stack
  a) https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1
  b) this is a set of resources, all provisioned together, based on a template
  c) infrastructure as code!
5) DynamoDB accessed by lambdas and specified in serverless.yaml file
  a) https://console.aws.amazon.com/dynamodb/home?region=us-east-1#tables:

* NB: Sometimes changing region won't update the dashboard, so use the links
