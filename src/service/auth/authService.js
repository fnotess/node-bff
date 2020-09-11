/**
 * Auth Service functions
 *
 * @author: adis0892 on 23/07/20
 * */

import * as jwt from "jsonwebtoken";
import logger from "../../util/logger";
import * as HttpStatus from "http-status-codes";
import {createErrorResponse} from "../../mapper/responseMapper";
import jwkToPem from "jwk-to-pem";
import fetch from 'node-fetch';
import {getAuthConfig} from "../../config/configs";

export const unauthenticatedReturn = {
    authenticated: false,
    username: null
};

class AuthService {
    pems;

    constructor() {
        this.authConfig = getAuthConfig();
    }

    prepareToValidateToken = async (req, res) => {
        try {
            let token = req.headers[this.authConfig.CONFIG.authTokenHeaderAttribute];

            if (!token) {
                let errorMessage = 'Access token is missing from header';
                logger.error(errorMessage);
                this.sendUnauthenticatedErrorResponse(res, errorMessage);
                return unauthenticatedReturn;
            }

            if (!this.pems) {
                this.pems = {};

                //Download the JWKs and save it as PEM
                let response = await fetch(this.authConfig.CONFIG.jwkRequestUrl);
                let data = await response.json();
                let keys = data['keys'];
                for (let i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    let keyId = keys[i].kid;
                    let modulus = keys[i].n;
                    let exponent = keys[i].e;
                    let keyType = keys[i].kty;
                    let jwk = {kty: keyType, n: modulus, e: exponent};
                    this.pems[keyId] = jwkToPem(jwk);
                }
                return this.validateToken(this.pems, token, res);


            } else {
                return this.validateToken(this.pems, token, res);
            }
        } catch (e) {
            let errorMessage = `Unexpected error occurred while validating the token`;
            this.sendUnauthenticatedErrorResponse(res, errorMessage);
            logger.error(`${errorMessage}: ${e}`);
            return unauthenticatedReturn;
        }
    }

    validateToken = (pems, token, res) => {
        let errorMessage;
        let decodedJwt = jwt.decode(token, {complete: true});

        if (!decodedJwt) {
            errorMessage = 'Not a valid JWT token';
            this.sendUnauthenticatedErrorResponse(res, errorMessage)
            return unauthenticatedReturn;
        }

        // Fail if token is not from the matching User Pool
        if (decodedJwt.payload.iss !== this.authConfig.CONFIG.authTokenIssuer) {
            errorMessage = 'The issuer of the token is invalid';
            logger.error(errorMessage);
            this.sendUnauthenticatedErrorResponse(res, errorMessage);
            return unauthenticatedReturn;
        }

        //Reject the jwt if it's not an 'Access Token'
        if (decodedJwt.payload.token_use !== 'access') {
            errorMessage = 'Token is not an access toke';
            logger.error(errorMessage);
            this.sendUnauthenticatedErrorResponse(res, errorMessage);
            return unauthenticatedReturn;
        }

        let kid = decodedJwt.header.kid;

        let pem = pems[kid];
        if (!pem) {
            logger.error('No pem could be found for the given kid', kid);
            this.sendUnauthenticatedErrorResponse(res, 'Invalid access token')
            return unauthenticatedReturn;
        }

        let returnObj = unauthenticatedReturn;
        //Verify the signature of the JWT token to ensure it's really coming from the matching User Pool
        jwt.verify(token, pem, {algorithms: ["RS256"]}, (err, payload) => {
            if (err) {
                logger.error(`Token was failed to be verified with error: ${err}`);
                this.sendUnauthenticatedErrorResponse(res, err.message);
                returnObj = unauthenticatedReturn;

            } else {
                let principalId = payload.sub;
                let usernameWithAdTag = payload.username;

                if (principalId && usernameWithAdTag) {
                    let username = usernameWithAdTag.split('_')[1];
                    if (username) {
                        // Pass to the authorization
                        logger.info(`The user's principal id: ${principalId} username: ${username}`);
                        returnObj = {
                            authenticated: true,
                            username: username
                        };
                    } else {
                        logger.error(`Username in the auth token is not in the expected format: ${username}`);
                        this.sendUnauthenticatedErrorResponse(res, 'Username given in the authentication token is invalid');
                    }
                } else {
                    logger.error(`After token verification either principal id: ${principalId} or username: ${usernameWithAdTag} is not present`);
                    this.sendUnauthenticatedErrorResponse(res, 'Required variables for authentication are invalid');
                }
            }
        });
        return returnObj;
    }

    sendUnauthenticatedErrorResponse = (res, cause) => {
        res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized', 'User cannot be authenticated',
            null, cause));
    }

}

export default new AuthService();