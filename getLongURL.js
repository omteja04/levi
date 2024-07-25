import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const dynamo = new DynamoDBClient({ region: 'us-east-1' });

export const handler = async (event) => {
    console.log("Input to the lambda function:", JSON.stringify(event, null, 2));

    let shortURL;
    try {
        shortURL = event.shortURL;
    } catch (err) {
        console.error("Error parsing event body:", err.message);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Bad Request: Invalid event body format" })
        };
    }

    if (!shortURL) {
        console.error("No shortURL provided in the event.");
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Bad Request: No shortURL provided" })
        };
    }

    const params = {
        TableName: "URL-Shortener",
        Key: {
            shortURL: { S: shortURL }
        }
    };

    try {
        const command = new GetItemCommand(params);
        const response = await dynamo.send(command);
        console.log("Response from DDB:", JSON.stringify(response, null, 2));

        if (response.Item) {
            if (response.Item.longURL && response.Item.longURL.S) {
                return {
                    statusCode: 302,
                    headers: {
                        Location: response.Item.longURL.S
                    }
                };
            } else {
                console.error("The longURL attribute is missing in the DynamoDB response.");
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: "Internal Server Error", error: "The longURL attribute is missing in the DynamoDB response." })
                };
            }
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "URL not found" })
            };
        }
    } catch (err) {
        console.error("Error while fetching data from DDB:", err.message);
        console.error("Error stack:", err.stack);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: err.message })
        };
    }
};
