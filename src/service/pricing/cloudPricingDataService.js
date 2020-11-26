/**
 * Cloud Pricing Data Service
 *
 * @author: adis0892 on 03/08/20
 * */

import {getCloudPricingConfig} from '../../config/configs';
import {httpClient} from '../../httpClient/httpClient';
import logger from '../../util/logger';
import CloudPricingDataFetchException from '../../exception/cloudPricingDataFetchException';
import { getCorrelationId } from '../../util/correlationIdGenerator';
import {
    HTTP_POST, ERROR_IN_FETCHING_CLOUD_PRICING_DATA,
    APPLICATION_JSON, CORRELATION_ID_HEADER, ORDER_PRICE_TYPE_HAND
} from '../../util/constants';

class CloudPricingDataService {
    constructor() {
        this.cloudPricingConfig = getCloudPricingConfig();
    }

    async getCloudPricingData(req) {
        const body = {
            businessUnitNumber: `${req.body.businessUnitNumber}`,
            customerAccount: `${req.body.customerAccount}`,
            priceRequestDate: `${req.body.priceRequestDate}`,
            products: [
                { ...req.body.product },
            ],
        };
        const headers = {
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.cloudPricingConfig.CONFIG.clientId,
            priceEngineType: this.cloudPricingConfig.CONFIG.priceEngineType,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        };

        const reqUrl = this.cloudPricingConfig.CONFIG.cloudPricingBaseUrl
            + this.cloudPricingConfig.CONFIG.productPricesEndpoint;
        return this.sendRequest(reqUrl, headers, body);
    }

    async getCloudPricingPCIData(req) {
        const body = {
            businessUnitNumber: `${req.body.businessUnitNumber}`,
            customerAccount: `${req.body.customerAccount}`,
            priceRequestDate: `${req.body.priceRequestDate}`,
            products: [
                { ...req.body.product, quantity: `${req.body.requestedQuantity}` },
            ],
        };

        if(req.orderPrice) {
            body.orderPrice = req.orderPrice;
            body.orderPriceType = req.orderPriceType ? req.orderPriceType : ORDER_PRICE_TYPE_HAND
        }

        const headers = {
            'Content-type': APPLICATION_JSON,
            Accept: APPLICATION_JSON,
            clientID: this.cloudPricingConfig.CONFIG.clientId,
            priceEngineType: this.cloudPricingConfig.CONFIG.priceEngineType,
            [CORRELATION_ID_HEADER]: getCorrelationId(),
        };

        const reqUrl = this.cloudPricingConfig.CONFIG.cloudPricingBaseUrl + this.cloudPricingConfig.CONFIG.pciPricesEndpoint;

        return this.sendRequest(reqUrl, headers, body);
    }

    async sendRequest(reqUrl, headers, body) {
        try {
            return await httpClient.makeRequest(
                HTTP_POST, reqUrl, body, headers,
            );
        } catch (e) {
            const specificErrorMessage = e.errorDetails.response.data.message;
            const errorMessage = `${ERROR_IN_FETCHING_CLOUD_PRICING_DATA}, ${specificErrorMessage}`;
            logger.error(`${errorMessage} ${reqUrl} due to: ${e}, stacktrace: ${e.stack}`);
            const cpErrorCode = e.errorDetails.response.data.code;
            throw new CloudPricingDataFetchException(
                errorMessage,
                e.message,
                cpErrorCode,
            );
        }
    }
}

export default new CloudPricingDataService();
