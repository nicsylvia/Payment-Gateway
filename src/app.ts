import express, { Application, Request, Response } from "express";

import cors from "cors"

import morgan from "morgan"
import UserRouter from "./Routes/UserRoutes";
import BusinessRouter from "./Routes/BusinessRoutes";

export const AppConfig = (app: Application) =>{
    app.use(express.json())
    app.use(cors())
    app.use(morgan("dev"))

    // Configuring the routes:
    app.use("/api", UserRouter)
    app.use("/api", BusinessRouter)
}