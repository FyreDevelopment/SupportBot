import Client from "./util/client";
import env from "dotenv";

export const client = new Client();

env.config();
client.login();