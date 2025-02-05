import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const now = util.time.nowISO8601();
  const userId = util.autoUlid().toLowerCase();
  const email = ctx.arguments.email.toLowerCase();

  const item = {
    ...ctx.arguments,
    userId,
    email,
    createdAt: now,
    updatedAt: now,
  };

  const key = {
    PK: `01:User#${userId}`,
    SK: `01:User`,
  };

  return ddb.put({
    key,
    item,
  });
}

export function response(ctx) {
  return ctx.result;
}
