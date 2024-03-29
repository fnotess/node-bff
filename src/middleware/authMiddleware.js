import * as HttpStatus from 'http-status-codes';
import {
AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK, AUTHENTICATION_NOT_REQUIRED_STATUS_CHECK, LOGIN_URL, LOGOUT_URL,
} from '../util/constants';
import AuthenticateService from '../service/auth/authenticateService';
import logger from '../util/logger';
import {createErrorResponse} from '../mapper/responseMapper';
import {USER_UNAUTHORIZED_ERROR_CODE} from '../exception/exceptionCodes';

export async function authMiddleware(req, res, next) {
    if (process.env.STAGE !== 'LOCAL'
        && (req.url !== AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK)
        && (req.url !== AUTHENTICATION_NOT_REQUIRED_STATUS_CHECK)
        && (req.url !== LOGOUT_URL)) {
        try {
            logger.debug('Sending to authenticate the request');
            const authResponse = await AuthenticateService.prepareToValidateToken(req, res);

            /* Since login is browser calls from frontend, unauthenticated response should be res.direct to an login error,
            can't directly send an error response like for other rest ajax calls. For all the other calls check whether
            the user is properly and if not send a http error response
             */
            if (req.url === LOGIN_URL || authResponse.authenticated) {
                res.locals.authResponse = authResponse;
                next();
            } else {
                res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized', 'User cannot be authenticated',
                    null, authResponse.cause, USER_UNAUTHORIZED_ERROR_CODE));
            }
        } catch (error) {
            const errMessage = 'Authorization interceptor failed';
            logger.error(`${errMessage}: ${error} cause: ${error.stack}`);

            if (req.url === LOGIN_URL) {
                res.locals.authResponse = AuthenticateService.sendUnauthenticatedErrorResponse(errMessage);
                next();
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(createErrorResponse(null, errMessage, error, null));
            }
        }
    } else {
        next();
    }
}
