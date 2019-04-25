import * as express from "express";
import * as passport from "passport";
import * as passportJWT from "passport-jwt";
import { Container } from "typedi";
import { AuthService } from "../../services/AuthService";
import { Configuration } from "../components/Configuration";
import { AppError, CustomErrors } from "./AppErrors";

/**
 * Passport manager
 * @class
 */
export const Passport = {

    init(app: express.Application): void {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.deserializeUser((user: any, done: any) => {
            done(undefined, user.id);
        });

        this.initStrategy(app);
    },

    initStrategy(app: express.Application): void {
        const ExtractJwt = passportJWT.ExtractJwt;
        const JwtStrategy = passportJWT.Strategy;
        const jwtOptions = {
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Container.get<Configuration>(Configuration).get<string>("secretKey")
        };

        passport.use(new JwtStrategy(jwtOptions,
                                     async (req: express.Request, jwtPayload: any,
                                            next: (err?: AppError, result?: UserModel) => void) =>  {
            try {
                const user: UserModel = await AuthService.auth(req.headers.authorization.replace("Bearer ", ""), jwtPayload.sub);
                if (user) {
                    next(undefined, user);
                } else {
                    next(new AppError(CustomErrors.AuthorizationRequired));
                }
            } catch (err) {
                next(err);
            }
        }));
    }

};
