import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(data);

  const params = {
    TableName: "myfridge",
    Item: {
      category: data.category,
      id: uuid.v1(),
      productName: data.productName,
      bestBefore: data.bestBefore,
      price: data.price,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
