import dotenv from "dotenv";

dotenv.config();

export const EnvironmentVariables = {
    port: process.env.PORT as string
}