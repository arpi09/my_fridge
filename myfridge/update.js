import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "myfridge",
    Key: {
      category: event.requestContext.category.categoryName,
      id: event.pathParameters.id
    },
    UpdateExpression: "SET productName = :productName, bestBefore = :bestBefore, price = :price",
    ExpressionAttributeValues: {
      ":productName": data.productName || null,
      ":bestBefore": data.bestBefore || null,
      ":price": data.price || null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
