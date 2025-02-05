import type { PreSignUpTriggerHandler } from "aws-lambda";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";

import { env } from "$amplify/env/preSignUpLambda";

import { type Schema } from "../../data/resource";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PreSignUpTriggerHandler = async (event) => {
  console.log("event", JSON.stringify(event, null, 2));

  const [firstName, lastName = ""] =
    event.request.userAttributes.name?.split(" ") ?? [];

  const { errors: userErrors } = await client.mutations.createUser({
    email: event.request.userAttributes.email,
    firstName,
    lastName,
  });

  console.error("createErrors", JSON.stringify(userErrors, null, 2));

  if (userErrors?.length) {
    throw new Error("failed_to_create_user");
  }

  return event;
};
