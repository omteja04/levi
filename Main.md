<!--
  Author: omteja04
  Created on: 22-07-2024 09:53:59
  Description: Main
-->


### **Serverless URL Shortener Using AWS Lambda and DynamoDB**

#### **Objective:**
Create a URL shortening service that allows users to shorten long URLs and redirects users from the short URLs to the original long URLs.

#### **Components and Detailed Steps:**

1. **AWS Lambda:**

   - **Function 1: Shorten URL Function**
     - **Input:** A long URL from the user.
     - **Process:**
       - Generate a unique short code (e.g., a base62-encoded string).
       - Store the mapping of the short code to the long URL in DynamoDB.
       - Return the short URL to the user.
     - **Code Example:**
       ```python
       import json
       import boto3
       from hashlib import md5

       dynamodb = boto3.resource('dynamodb')
       table = dynamodb.Table('URLMapping')

       def lambda_handler(event, context):
           long_url = event['queryStringParameters']['url']
           short_code = md5(long_url.encode()).hexdigest()[:6]  # Simple hash for short code
           
           table.put_item(
               Item={
                   'short_code': short_code,
                   'long_url': long_url
               }
           )
           
           short_url = f"https://short.url/{short_code}"
           return {
               'statusCode': 200,
               'body': json.dumps({'short_url': short_url})
           }
       ```

   - **Function 2: Redirect Function**
     - **Input:** A short code from the user.
     - **Process:**
       - Look up the short code in DynamoDB.
       - Retrieve the corresponding long URL.
       - Redirect the user to the long URL.
     - **Code Example:**
       ```python
       import json
       import boto3

       dynamodb = boto3.resource('dynamodb')
       table = dynamodb.Table('URLMapping')

       def lambda_handler(event, context):
           short_code = event['pathParameters']['code']
           response = table.get_item(Key={'short_code': short_code})
           
           if 'Item' in response:
               long_url = response['Item']['long_url']
               return {
                   'statusCode': 302,
                   'headers': {
                       'Location': long_url
                   }
               }
           else:
               return {
                   'statusCode': 404,
                   'body': json.dumps({'error': 'URL not found'})
               }
       ```

2. **Amazon API Gateway:**

   - **Set Up REST API:**
     - Create an API with two endpoints:
       - **POST /shorten:** To shorten a URL.
       - **GET /{code}:** To redirect from a short URL to the original URL.
     - **Integrate API Gateway with Lambda Functions:**
       - Configure the POST endpoint to trigger the Shorten URL Lambda function.
       - Configure the GET endpoint to trigger the Redirect Lambda function.

3. **Amazon DynamoDB:**

   - **Create a Table:**
     - **Table Name:** `URLMapping`
     - **Primary Key:** `short_code` (String)
     - **Attributes:** `long_url` (String)

   - **DynamoDB Table Setup:**
     - Use the AWS Management Console or AWS CLI to create the table.
     - Ensure that the Lambda functions have permissions to read and write to this table.

4. **AWS IAM:**

   - **Create IAM Role for Lambda:**
     - Attach policies allowing Lambda functions to access DynamoDB (e.g., `AmazonDynamoDBFullAccess`).

   - **Attach IAM Role to Lambda Functions:**
     - Assign the IAM role to both Lambda functions to allow them to interact with DynamoDB.
****
5. **Optional - Frontend:**

   - **Create a Simple HTML Form:**
     - **HTML Form for URL Shortening:**
       ```html
       <html>
       <body>
           <h1>URL Shortener</h1>
           <form id="urlForm">
               <label for="url">Enter URL:</label>
               <input type="text" id="url" name="url" required>
               <button type="submit">Shorten URL</button>
           </form>
           <p id="result"></p>
           <script>
               document.getElementById('urlForm').addEventListener('submit', function(event) {
                   event.preventDefault();
                   const url = document.getElementById('url').value;
                   fetch('https://YOUR_API_GATEWAY_URL/shorten?url=' + encodeURIComponent(url), {
                       method: 'POST'
                   })
                   .then(response => response.json())
                   .then(data => {
                       document.getElementById('result').innerText = 'Short URL: ' + data.short_url;
                   });
               });
           </script>
       </body>
       </html>
       ```

   - **Host the HTML on Amazon S3:**
     - Create an S3 bucket and configure it to host a static website.
     - Upload the HTML file to the bucket.
     - Update your bucket policy to make it publicly accessible.

#### **Testing and Deployment:**

1. **Test the Lambda Functions:**
   - Use AWS Lambda’s test functionality to verify each function.

2. **Test API Gateway Endpoints:**
   - Use tools like Postman or cURL to test API endpoints.

3. **Deploy and Verify:**
   - Deploy the API Gateway and ensure it is correctly integrated with Lambda functions.
   - Access the S3 bucket URL to verify the front-end form functionality.

This mini project will give you practical experience with AWS Lambda, API Gateway, DynamoDB, and optionally S3 for static site hosting.