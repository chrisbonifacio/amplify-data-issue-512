import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/

export const preSignUp = defineFunction({
  name: "preSignUp",
  entry: "create-user/handler.ts",
});

const schema = a
  .schema({
    Identity: a
      .model({
        PK: a.string().required(),
        SK: a.string().required(),
        GSI1PK: a.string().required(),
        GSI1SK: a.string().required(),
      })
      .identifier(["PK", "SK"])
      .authorization((allow) => [allow.authenticated()])
      .disableOperations(["mutations", "subscriptions", "queries", "list"])
      .secondaryIndexes((index) => [
        index("GSI1PK").sortKeys(["GSI1SK"]).name("GSI1"),
      ]),

    User: a.customType({
      email: a.string().required(),
    }),

    createUser: a
      .mutation()
      .returns(a.ref("User"))
      .authorization((allow) => [allow.custom(), allow.authenticated()])
      .arguments({
        firstName: a.string(),
        lastName: a.string(),
        email: a.string().required(),
      })
      .handler([
        a.handler.custom({
          dataSource: a.ref("Identity"),
          entry: "create-user/put-item.js",
        }),
      ]),
  })
  .authorization((allow) => [allow.resource(preSignUp)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  name: "amplifyDataIssue512",
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
