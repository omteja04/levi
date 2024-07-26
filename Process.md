<!--
  Author: omteja04
  Created on: 25-07-2024 21:24:05
  Description: Process
-->

- [Serverless URL Shortener: Building and Deploying a Web Application with AWS Lambda](#serverless-url-shortener-building-and-deploying-a-web-application-with-aws-lambda)
  - [Creation of DynamoDB](#creation-of-dynamodb)
  - [Creation of Lambda Functions](#creation-of-lambda-functions)
    - [`create` function](#create-function)
    - [`redirect` function](#redirect-function)
  - [API Gateways Creation](#api-gateways-creation)
    - [POST Method](#post-method)
    - [GET Method](#get-method)

# Serverless URL Shortener: Building and Deploying a Web Application with AWS Lambda

## Creation of DynamoDB

- Table Name: `URL-Shortener`
- Partition Key: `shortURL`
- Global Secondary Index: `longURL`
- Create Table

## Creation of Lambda Functions

### `create` function

- Function Name: `create`
- Runtime: `Node.js`
- Create Function
- [Add this Code](./CreateShortURL.js)
- click `Deploy`
- Go to Configuration
- Click Permissions
- Click on the role name (eg: `create-role-5azxswxa`)
- Click Given Policy Name
- Add `PutItem` & `UpdateItem` permissions and add Resource `ARN of the DynamoDB Table`
- Add `Environment Variable`
- Key: `DOMAIN_NAME`
- Value: `omteja04.github.io/levi`

### `redirect` function

- Function Name: `redirect`
- Runtime: `Node.js`
- Create Function
- [Add this Code](./getLongURL.js)
- click `Deploy`
- go to Configuration
- Click Permissions
- Click on the role name (eg: `redirect-role-5azxswxa`)
- Click Given Policy Name
- Add `GetItem` permissions and add Resource `ARN of the DynamoDB Table`

## API Gateways Creation

- Go to API Gateway Service
- Go to REST API and Click Build
- Click `New API`
- API Name: `url-shortener`

### POST Method

- Add Resource: `shorten`
- Method: `POST`
- Create Method
- Click `Enable CORS` for the resource
- Check `POST` method
- Enable the CORS

### GET Method

- Add Resource: `{shortURL}`
- Method: `GET`
- Create Method
- Click `Enable CORS` for the resource
- Check `GET` method
- Enable the CORS
- CLick `Integration Request`
- Go to `Mapping Templates`
- `application/json`
- [Add this Template](./GET-integration-request-mapping-template.json)
- Save Changes

> Deploy APIs

---

Backend is Completed
