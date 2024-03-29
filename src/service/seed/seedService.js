import {getSeedApiConfig, getSeedApiBaseUrl} from '../../config/configs';
import SeedApiDataFetchException from '../../exception/seedApiDataFechException';
// constants
import {
    UNKNOWN_SEED_API_ERROR_MESSAGE,
    GENERIC_SEED_API_ERROR_MESSAGE,
} from '../../util/constants';
import {UNKNOWN_SEED_API_ERROR, UNKNOWN_SEED_API_CAUGHT_ERROR} from '../../exception/exceptionCodes';

import ApiCentralClient from '../../httpClient/apiCentralClient';

class SeedService {
    constructor() {
        this.seedApiConfig = getSeedApiConfig();
    }

    generateRequestConfigs() {
        return {
            timeout: this.seedApiConfig.CONFIG.timeout,
            baseURL: getSeedApiBaseUrl(),
        };
    }

    static handleError(error) {
        const errorData = error.errorDetails?.response?.data;
        if (errorData) {
            const errorCode = Number(errorData.code);
            const errorMesssage = errorData.message ? errorData.message : GENERIC_SEED_API_ERROR_MESSAGE;
            if (errorCode) {
                throw new SeedApiDataFetchException(error, errorMesssage, errorCode);
            }
            throw new SeedApiDataFetchException(error, UNKNOWN_SEED_API_ERROR_MESSAGE, UNKNOWN_SEED_API_ERROR);
        }
        throw new SeedApiDataFetchException(error, UNKNOWN_SEED_API_ERROR_MESSAGE, UNKNOWN_SEED_API_CAUGHT_ERROR);
    }

    async getSeedItemAttributeGroupsData() {
        const endpoint = this.seedApiConfig.CONFIG.getItemAttributeGroupsEndpoint;
        try {
            return await ApiCentralClient.get(endpoint, null, this.generateRequestConfigs());
        } catch (error) {
            return SeedService.handleError(error);
        }
    }

    async getPriceZoneDetailsForCustomerAndItemAttributeGroup(req) {
        const endpoint = this.seedApiConfig.CONFIG.getCustomerAndItemAttributeGroupsEndpoint;
        try {
            return await ApiCentralClient.post(endpoint, req.body, null, null, this.generateRequestConfigs());
        } catch (error) {
            return SeedService.handleError(error);
        }
    }

    async getPriceZoneDetailsForCustomerGroupAndItemAttributeGroup(req) {
        const endpoint = this.seedApiConfig.CONFIG.getCustomerGroupAndItemAttributeGroupsEndpoint;
        try {
            return await ApiCentralClient.post(endpoint, req.body, null, null, this.generateRequestConfigs());
        } catch (error) {
            return SeedService.handleError(error);
        }
    }
}

export default new SeedService();
