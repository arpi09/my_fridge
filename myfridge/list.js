import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {

  const params = {
    TableName: "myfridge",
    KeyConditionExpression: "category = :dairy",
    ExpressionAttributeValues: {
      ":dairy": "Dairy"
    }
  };
  console.log(params);
  try {
    const result = await dynamoDbLib.call("query", params);
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
}
