/**
 * Pricing Data routes
 *
 * @author: adis0892 on 03/08/20
 * */

import { Router } from 'express';
import * as HttpStatus from 'http-status-codes';
import AggregatedPricingDataService from '../../../service/pricing/aggregatedPricingDataService';
import logger from '../../../util/logger';
import { createErrorResponse } from '../../../mapper/responseMapper';
import AuthorizationService from '../../../service/auth/authorizationService';
import CloudPricingDataFetchException from '../../../exception/cloudPricingDataFetchException';
import InvalidRequestException from '../../../exception/invalidRequestException';
import ProductInfoDataFetchException from '../../../exception/productInfoDataFetchException';

export default () => {
    const cloudPricingRouter = new Router({ mergeParams: true });

    cloudPricingRouter.post('/pricing-data', async (req, res) => {
        try {
            const isAuthorized = AuthorizationService.isAuthorizedRequest(req, res);

            if (isAuthorized) {
                const responseData = await AggregatedPricingDataService.getAggregatedPricingData(req);
                logger.debug("Success response received");
                res.status(HttpStatus.OK)
                    .send(responseData);
            } else {
                res.status(HttpStatus.UNAUTHORIZED).send(createErrorResponse('Unauthorized',
                    'User is not authorized to perform this action in the requested opco',
                    null, 'User authorization validations failed'));
            }
        } catch (error) {
            const errMessage = 'Error occurred in getting pricing related data';
            logger.error(`${errMessage}: ${error} cause: ${error.stack} errorCode: ${error.errorCode}`);
            let httpStatusCode;
            if (error instanceof CloudPricingDataFetchException ||
                error instanceof ProductInfoDataFetchException ||
                error instanceof InvalidRequestException) {
                httpStatusCode = HttpStatus.BAD_REQUEST;
            } else {
                httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            }
            res.status(httpStatusCode)
                .send(createErrorResponse(null, errMessage, error, null, error.errorCode));
        }
    });
    return cloudPricingRouter;
};
