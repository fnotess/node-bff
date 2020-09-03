import {ROLE_APP_ADMIN, ROLE_GENERAL_USER} from "../../util/constants";

/**
 * BusinessUnit Authorization unit tests
 *
 * @author: adis0892 on 02/08/20
 * */
jest.mock('../../dao/businessUnitDao');

import BusinessUnitAuthorization from '../auth/businessUnitAuthorization';
import {jest} from "@jest/globals";
import BusinessUnitDao from '../../dao/businessUnitDao'

const OTHER_ROLE = 'otherRole'

const bUnitDetailForOpco001 =     {
    bunit_id: '001',
    bunit_name: 'Sysco Jackson',
    periscope_on: 'Y'
};

const bUnitDetailForOpco003 = {
    bunit_id: '003',
    bunit_name: 'Sysco Jacksonville',
    periscope_on: 'Y'
};

const bUnitDetailsArray = [
    bUnitDetailForOpco001,

     {
        bunit_id: '002',
        bunit_name: 'Sysco Atlanta',
        periscope_on: 'N'
    },

    bUnitDetailForOpco003,

     {
        bunit_id: '004',
        bunit_name: 'Sysco Central California',
        periscope_on: 'N'
    },
     {
        bunit_id: '005',
        bunit_name: 'Sysco Intermountain',
        periscope_on: 'N'
    }
    ]

describe('Auth Service', () => {
    test('should send the bunit array of the given bunit when the passed bunit matches with one in the passed bunit details array', async () => {

        const filteredArray = BusinessUnitAuthorization.matchedValidBusinessUnitFromGivenList('001', bUnitDetailsArray);
        expect(filteredArray).toEqual([bUnitDetailForOpco001]);
    });

    test('should send an empty array when the passed bunit does not match with one in the passed bunit details array', async () => {

        const filteredArray = BusinessUnitAuthorization.matchedValidBusinessUnitFromGivenList('900', bUnitDetailsArray);
        expect(filteredArray).toEqual([]);
    });

    test('should send an empty array when the passed bunit details is empty', async () => {

        const filteredArray = BusinessUnitAuthorization.matchedValidBusinessUnitFromGivenList('001', []);
        expect(filteredArray).toEqual([]);
    });

    test('should send the bunit array of the given bunit when the passed bunit matches one bunit that has periscope_on as Y ' +
        'and is in the bunit details array', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray)

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.matchedPricingTransformationEnabledBusinessUnit('001');
        expect(filteredArray).toEqual([bUnitDetailForOpco001]);
    });

    test('should send an empty array when the passed bunit has periscope_on as N although it is in the bunit details array', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray)

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.matchedPricingTransformationEnabledBusinessUnit('002');
        expect(filteredArray).toEqual([]);
    });

    test('should send an empty array when the passed bunit does not match a bunit in the bunit details array', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray)

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.matchedPricingTransformationEnabledBusinessUnit('900');
        expect(filteredArray).toEqual([]);
    });

    test('should send an empty array when the bunit details array is null', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(null)

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.matchedPricingTransformationEnabledBusinessUnit('001');
        expect(filteredArray).toEqual([]);
    });

    test('should send the bunit array of that have periscope_on as Y when called generatePricingTransformationEnabledAllBusinessUnit', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray)

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.generatePricingTransformationEnabledAllBusinessUnit();
        expect(filteredArray).toEqual([bUnitDetailForOpco001, bUnitDetailForOpco003]);
    });

    test('should send an empty array when all bunits have periscope_on as N when called generatePricingTransformationEnabledAllBusinessUnit', async () => {
        const bUnitDetailsArrayWithNoPerisoceOnYes = [
            {
                bunit_id: '002',
                bunit_name: 'Sysco Atlanta',
                periscope_on: 'N'
            },
            {
                bunit_id: '004',
                bunit_name: 'Sysco Central California',
                periscope_on: 'N'
            },
            {
                bunit_id: '005',
                bunit_name: 'Sysco Intermountain',
                periscope_on: 'N'
            }
        ]

        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArrayWithNoPerisoceOnYes)

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.generatePricingTransformationEnabledAllBusinessUnit();
        expect(filteredArray).toEqual([]);
    });

    test('should send an empty array when called bUnitDetailsArray is empty', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue('')

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.generatePricingTransformationEnabledAllBusinessUnit();
        expect(filteredArray).toEqual([]);
    });

    test('should send the bunit array of that have periscope_on as Y when called with user role: ROLE_APP_ADMIN', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.getAuthorizedBusinessUnits('001', ROLE_APP_ADMIN);
        expect(filteredArray).toEqual([bUnitDetailForOpco001, bUnitDetailForOpco003]);
    });

    test('should send the bunit array of that have periscope_on as Y when called with user role: ROLE_GENERAL_USER', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.getAuthorizedBusinessUnits('001', ROLE_GENERAL_USER);
        expect(filteredArray).toEqual([bUnitDetailForOpco001, bUnitDetailForOpco003]);
    });

    test('should send an empty array when opcoAtrribute is passed as null', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.getAuthorizedBusinessUnits(null, OTHER_ROLE);
        expect(filteredArray).toEqual([]);
    });

    test('should send an empty array when opcoAtrribute is passed empty', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.getAuthorizedBusinessUnits('', OTHER_ROLE);
        expect(filteredArray).toEqual([]);
    });

    test('should send the bunit array with opco details of users authorized opoco when opcoAtrribute has a matching value ' +
        'that satisfies the authorization condition: one matching opco and it is periscope_on Y', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.getAuthorizedBusinessUnits('001', OTHER_ROLE);
        expect(filteredArray).toEqual([bUnitDetailForOpco001]);
    });

    test('should send an empty array even though the passed bunit it a matching one to the list of bunit but is not periscope_on N', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.getAuthorizedBusinessUnits('005', OTHER_ROLE);
        expect(filteredArray).toEqual([]);
    });

    test('should send all the periscope_on Y bunit when the passed opco does not match one of the given bunit details array ' +
        'because it would be an indicator like 000: corporate, 341: sysco labs', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const filteredArray = BusinessUnitAuthorization.getAuthorizedBusinessUnits('341', OTHER_ROLE);
        expect(filteredArray).toEqual([bUnitDetailForOpco001, bUnitDetailForOpco003]);
    });

    test('should send isAuthorized as true when user requested for an opco that he is authorized to', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '001'
            }
        };

        const res = {
            locals: {
                authResponse: {
                    userDetailsData: {
                        "authorizedBunitList": [
                            {
                                bunit_id: '001',
                                bunit_name: 'Sysco Jackson',
                                periscope_on: 'Y'
                            },
                            {
                                bunit_id: '003',
                                bunit_name: 'Sysco Jacksonville',
                                periscope_on: 'Y'
                            },
                        ],
                        "email": "firstName.secondName@syscolabs.com",
                        "firstName": "firstName",
                        "jobTitle": "jobTitle",
                        "lastName": "secondName",
                        "username": "username"
                    }
                }
            }
        };

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const isAuthorized = BusinessUnitAuthorization.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(true);
    });

    test('should send isAuthorized as false when user requested for an opco that he is not authorized to', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '005'
            }
        };

        const res = {
            locals: {
                authResponse: {
                    userDetailsData: {
                        "authorizedBunitList": [
                            {
                                bunit_id: '001',
                                bunit_name: 'Sysco Jackson',
                                periscope_on: 'Y'
                            },
                            {
                                bunit_id: '003',
                                bunit_name: 'Sysco Jacksonville',
                                periscope_on: 'Y'
                            },
                        ],
                        "email": "firstName.secondName@syscolabs.com",
                        "firstName": "firstName",
                        "jobTitle": "jobTitle",
                        "lastName": "secondName",
                        "username": "username"
                    }
                }
            }
        };

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const isAuthorized = BusinessUnitAuthorization.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(false);
    });

    test('should send isAuthorized as false when user details in users auth response is not defined', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '005'
            }
        };

        const res = {
            locals: {
                authResponse: {}
            }
        };

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const isAuthorized = BusinessUnitAuthorization.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(false);
    });

    test('should send isAuthorized as false when authorizedBunitList is empty in users auth response', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '005'
            }
        };

        const res = {
            locals: {
                authResponse: {
                    userDetailsData: {
                        "authorizedBunitList": [],
                        "email": "firstName.secondName@syscolabs.com",
                        "firstName": "firstName",
                        "jobTitle": "jobTitle",
                        "lastName": "secondName",
                        "username": "username"
                    }
                }
            }
        };

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const isAuthorized = BusinessUnitAuthorization.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(false);
    });

    test('should send isAuthorized as false when authorizedBunitList is not defined in users auth response', async () => {
        BusinessUnitDao.getBusinessUnitDetails.mockReturnValue(bUnitDetailsArray);

        const req = {
            body: {
                businessUnitNumber: '005'
            }
        };

        const res = {
            locals: {
                authResponse: {
                    userDetailsData: {
                        "email": "firstName.secondName@syscolabs.com",
                        "firstName": "firstName",
                        "jobTitle": "jobTitle",
                        "lastName": "secondName",
                        "username": "username"
                    }
                }
            }
        };

        await BusinessUnitAuthorization.loadBusinessUnitDetails();

        const isAuthorized = BusinessUnitAuthorization.isAuthorizedRequest(req, res);
        expect(isAuthorized).toEqual(false);
    });
});
