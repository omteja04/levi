import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import crypto from 'crypto';

const dynamo = new DynamoDBClient({ region: 'us-east-1' });

export const handler = async (event) => {
    // const body = JSON.parse(event.body);
    const longURL = event.longURL;

    if (!longURL) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'URL is required' })
        };
    } const shortURL = crypto.randomBytes(3).toString('hex');
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const params = {
        TableName: "URL-Shortener",
        Item: {
            shortURL: { S: shortURL },
            longURL: { S: longURL },
            expirationDate: { S: expirationDate.toISOString() }
        }
    }; try {
        const command = new PutItemCommand(params);
        await dynamo.send(command);
        return {
            statusCode: 200,
            body: {
                shortURL: shortURL,
                redirectedURL: `https://${process.env.DOMAIN_NAME}/?code=${shortURL}`
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

