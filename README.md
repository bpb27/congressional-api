### Setup and Deployment Notes

## Basic Config:
1) SERVICE: serverless-api
2) REGION: us-west-2
3) STAGE: dev
4) RUNTIME: nodejs6.10

## AWS Services used:
1) S3 for versioning
  a) https://console.aws.amazon.com/s3/home?region=us-west-2
  b) S3 is no longer region specific, just a single dashboard
2) Lambda for functions
  a) https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2
  b) is region specific
  c) deployed functions named service-staging-function
3) API Gateway for HTTP events
  a) https://us-west-2.console.aws.amazon.com/apigateway/home?region=us-west-2
  b) is region specific
4) CloudFormation for the stack
  a) https://us-west-2.console.aws.amazon.com/cloudformation/home?region=us-west-2
  b) this is a set of resources, all provisioned together for you, based on a template
  c) infrastructure as code!

* NB: Sometimes changing region won't update the dashboard, so use the links

## Commands
1) `serverless deploy --aws-profile serverless --stage dev --region us-west-2`
  a) profile flag maps to ~/.aws/credentials
  b) be sure to `nvm use 6.10`
2) `sls invoke -f hello -l`
  a) invoke function on cloud, print log
3) `sls invoke local -f hello -l`
  a) invoke function locally, print log
  b) won't work if you need to connect to resources that aren't mocked locally
