import type { APIGatewayRequestAuthorizerEventV2 } from "aws-lambda";
import type { APIGatewayAuthorizerResult } from "aws-lambda/trigger/api-gateway-authorizer";
import { middyfy } from "@libs/lambda";
import { getConfig } from "@libs/getConfig";

const config = getConfig();

const generatePolicy = (
  principalId: string,
  effect: "Allow" | "Deny",
  resource: string
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});

const getCredentialsFromAuthToken = (authToken: string): [string, string] => {
  const base64String = authToken.replace("Basic ", "");
  const decodedAuthValue = Buffer.from(base64String, "base64").toString(
    "utf-8"
  );
  const [username, password] = decodedAuthValue.split(":");
  return [username, password];
};

const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEventV2) => {
  console.log("### Event: ", JSON.stringify(event, null, 2));

  try {
    const authToken =
      event.headers?.["Authorization"] || event.headers?.["authorization"];
    const { routeArn } = event;

    console.log("### routeArn: ", routeArn, " authToken: ", authToken);

    if (!authToken) {
      return generatePolicy(authToken, "Deny", routeArn);
    }

    const [username, password] = getCredentialsFromAuthToken(authToken);

    const isValidCredentials =
      username === config.username && password === config.password;

    console.log("### username: ", username, " password: ", password);

    if (!isValidCredentials) {
      return generatePolicy(authToken, "Deny", routeArn);
    }

    return generatePolicy(authToken, "Allow", routeArn);
  } catch (error) {
    console.log("### error: ", JSON.stringify(error, null, 2));

    return generatePolicy("Error", "Deny", "*");
  }
};

export const main = middyfy(basicAuthorizer);
