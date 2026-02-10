import serverless from "serverless-http";
import app from "../../server/src/app";

export const handler = serverless(app, {
  basePath: "/.netlify/functions/api"
});
