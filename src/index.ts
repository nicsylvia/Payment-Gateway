import express, { Application, Request, Response } from "express";

import {EnvironmentVariables} from "../Config/EnvironmentVariables"

const port = EnvironmentVariables.port

const app: Application = express();

app.get("/", (req: Request, res: Response) =>{
    return res.status(200).json({
        message: "API READY FOR GIFT CARD IDEA CONSUMPTION"
    })
})