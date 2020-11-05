/**
 * Business unit authorization
 *
 * @author: adis0892 on 28/08/20
 * */

import BusinessUnitDao from '../../dao/businessUnitDao'
import {MAX_ROLE_HIERARCHY_NUMBER, ROLE_APP_ADMIN, ROLE_GENERAL_USER} from "../../util/constants";
import {getAuthorizationRoleHierarchy} from "../../config/configs";
import logger from "../../util/logger";

class AuthorizationService {
    businessUnitDetailsArray;

    loadBusinessUnitDetails = async () => {
        this.businessUnitDetailsArray = await BusinessUnitDao.getBusinessUnitDetails();
    };

    matchedValidBusinessUnitFromGivenList = (bUnit, bUnitDetailsList) => {
        if (bUnitDetailsList) {
            return bUnitDetailsList.filter(bUnitDetails =>
                bUnit === bUnitDetails.bunit_id
            )
        } else {
            return [];
        }
    }

    matchedPricingTransformationEnabledBusinessUnit = (bUnit) => {
        if (this.businessUnitDetailsArray) {
            return this.businessUnitDetailsArray.filter(bUnitDetails =>
                bUnit === bUnitDetails.bunit_id && bUnitDetails.periscope_on === "Y"
            )
        } else {
            return [];
        }
    }

    generatePricingTransformationEnabledAllBusinessUnit = () => {
        if (this.businessUnitDetailsArray) {
            return this.businessUnitDetailsArray.filter(bUnitDetails =>
                bUnitDetails.periscope_on === "Y"
            )
        } else {
            return [];
        }
    }

    getAuthorizedBusinessUnits = (opcoAttributeBunit, userRole) => {
        if (userRole === ROLE_APP_ADMIN || userRole === ROLE_GENERAL_USER) {
            // If these user roles, they should have access to all opcos
            logger.info(`User because of his user role: ${userRole} is given access to all opcos`);
            return this.generatePricingTransformationEnabledAllBusinessUnit();
        } else if (!opcoAttributeBunit || !userRole) {
            // If AD opco attribute or user role is null or empty, then he should not have access to any opco
            logger.info(`User's opco attribute: ${opcoAttributeBunit} or user role: ${userRole} is empty so giving access to no opco`);
            return []
        } else {
            const matchedValidBusinessUnitList =
                this.matchedValidBusinessUnitFromGivenList(opcoAttributeBunit, this.businessUnitDetailsArray);

            if (matchedValidBusinessUnitList.length > 0) {

                const authorizedPricingTransformationEnabledBusinessUnitList =
                    this.matchedPricingTransformationEnabledBusinessUnit(opcoAttributeBunit);

                if (authorizedPricingTransformationEnabledBusinessUnitList.length > 0) {
                    // Opco attribute matches one of the opcos and also is a pricing transformation enabled opco then return that opco
                    logger.info(`User's opco: ${opcoAttributeBunit} matches one of the pricing transformation enabled opco then giving access to that opco`);
                    return authorizedPricingTransformationEnabledBusinessUnitList
                } else {
                    // Opco attribute matches one of the opcos but is not a pricing transformation enabled opcos
                    // so then he has access to no matching opco
                    logger.info(`User's opco: ${opcoAttributeBunit} does not match with pricing transformation enabled opcos, so giving access to no opco`);
                    return []
                }
            } else {
                // Opco attribute does not match to one of Sysco opcos, so it should be something like 000 (Corporate) or 440 (SBS)
                // so then give access to all opcos
                // In future, if we can identify what exactly these values can be, then can do a separate filtering
                logger.info(`User's opco: ${opcoAttributeBunit} does not match to one of Sysco opcos but a specific value, so giving access to all opcos`);
                return this.generatePricingTransformationEnabledAllBusinessUnit();
            }
        }
    }

    isAuthorizedRequest = (req, res) => {
        logger.info("Authenticating request");
        const {authResponse} = res.locals;
        const requestedBunit = req.body.businessUnitNumber;
        const userDetailsData = authResponse.userDetailsData;

        if (userDetailsData && Object.keys(userDetailsData).length > 0) {
            const authorizedBunitListForTheUser = userDetailsData.authorizedBunitList;
            const filteredOutBunits = this.matchedValidBusinessUnitFromGivenList(requestedBunit, authorizedBunitListForTheUser);
            if (filteredOutBunits.length > 0) {
                logger.info(`User's requested opco: [${requestedBunit}] matched with his authorized opcos, so request is authorized`);
                return true;
            }
            logger.warn(`User's requested opco: ${requestedBunit} does not match with his authorized opcos: ${authorizedBunitListForTheUser},
             so request is NOT authorized`);
        } else {
            logger.warn(`User details data is empty for the request, so it is NOT authorized`);
        }
        return false;
    };

    getTheRoleWithHighestAuthority = (rolesArray) => {
        const authorizationRoleHierarchy = getAuthorizationRoleHierarchy();
        let selectedAuthorizedRole = '';

        let selectedHierarchyNumber = MAX_ROLE_HIERARCHY_NUMBER;
        rolesArray.forEach(roleFromUserLogin => {
            const hierarchyNumber = authorizationRoleHierarchy[roleFromUserLogin];

            if (selectedHierarchyNumber > hierarchyNumber) {
                selectedAuthorizedRole = roleFromUserLogin;
                selectedHierarchyNumber = hierarchyNumber;
            }
        });
        logger.info(`Out of all the user roles, user's highest authorized role was selected as ${selectedAuthorizedRole}`);
        return selectedAuthorizedRole;
    }
}

export default new AuthorizationService();