
/**
 * Bootstrap application
 */
import "reflect-metadata";
import { Container } from "typedi";
import { Application } from "./context/Application";
import { DatabasePhase, HttpServerPhase, SwaggerPhase } from "./context/boot/phases/Index";
import { Logger } from "./context/components/Logger";

Container.get<Application>(Application).bootstrap([
    new DatabasePhase(),
    new HttpServerPhase(),
    new SwaggerPhase(),
    // container.get<DocPhase>(DocPhase)
])
    .then((error: Error) => {
        Container.get<Logger>(Logger).info("Application started!");
    })
    .catch((error: Error) => {
        const l: Logger = Container.get<Logger>(Logger);
        l.error("Application not started");
        l.error(`Error: ${error}`);
    });
