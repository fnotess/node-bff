/**
 * Application constants
 *
 * */

export const CLOUD_PCI_BFF = 'Cloud PCI BFF';
export const CLOUD_PCI_BFF_VERSION = '1.8.0';
export const SUCCESS = 'success';
export const ERROR = 'error';

// AWS values
export const AWS_REGION = 'us-east-1';

// http methods
export const HTTP_GET = 'GET';
export const HTTP_POST = 'POST';
export const HTTP_DELETE = 'DELETE';
export const HTTP_PATCH = 'PATCH';

// HTTP req/res metadata
export const APPLICATION_JSON = 'application/json';
export const CORRELATION_ID_HEADER = 'X-Syy-Correlation-Id';

// errors
export const ERROR_IN_GETTING_S3_INPUT_SIGNED_URL = 'Error in getting S3 file upload signed urls';
export const ERROR_IN_GETTING_S3_OUTPUT_SIGNED_URL = 'Error in getting S3 file download signed urls';
export const ERROR_IN_GETTING_BATCH_JOBS = 'Error occurred while retrieving batch job details';
export const ERROR_IN_DELETING_BATCH_JOBS = 'Error occurred while deleting a batch job';
export const INVALID_REQUEST_BODY = 'Invalid/ Unsupported request body';
export const EMPTY_REQUEST_BODY = 'Empty request body';
export const ERROR_IN_FETCHING_CLOUD_PRICING_DATA = 'Failed to fetch data from Cloud Pricing Endpoint';
export const ERROR_IN_FETCHING_SEED_ITEM_ATTRIBUTE_GROUP_DATA = 'Failed to fetch data from SEED while getting item attributes group data';
export const ERROR_IN_CREATING_CIPZ_PRICE_ZONE_UPDATE = 'Error occurred while creating price zone update request from CIPZ Api Endpoint';
export const ERROR_IN_HANDLING_CIPZ_PRICE_ZONE_UPDATE = 'Error occurred while handling price zone update request';
export const ERROR_IN_GETTING_CIPZ_PRICE_ZONE_SUBMITTED_REQ_DATA = 'Error occurred in getting CIPZ API submitted requests data';
export const ERROR_IN_RESPONSING_CIPZ_PRICE_ZONE_APPROVAL_REQ = 'Error occurred in responsing CIPZ API approval request';
export const ERROR_IN_HANDLING_SEARCH_RESULTS = 'Error occurred while handling the price zone reassignment search request';
export const UNKNOWN_SEED_API_ERROR_MESSAGE = 'Something went wrong while fetching data from SEED';
export const GENERIC_SEED_API_ERROR_MESSAGE = 'Error occurred while fetching the search results from SEED';
export const GENERIC_CIPZ_API_ERROR_MESSAGE = 'Error occurred while processing your request in CIPZ';
export const UNKNOWN_CIPZ_API_ERROR_MESSAGE = 'Something went wrong while fetching data from CIPZ';
// Price Zone Reassignment Routes
export const ITEM_ATTRIBUTE_GROUPS = '/item-attribute-groups';
export const PZ_UPDATE_REQUESTS = '/pz-update-requests';
export const PZ_UPDATES = '/pz-updates/:request_id';
export const PZ_SEARCH = '/search';

// whitelisted url paths
export const AUTHENTICATION_NOT_REQUIRED_HEALTH_CHECK = '/v1/pci-bff/support/healthcheck';
export const AUTHENTICATION_NOT_REQUIRED_STATUS_CHECK = '/v1/pci-bff/support/status';

export const LOGIN_URL = '/v1/pci-bff/auth/login';
export const LOGOUT_URL = '/v1/pci-bff/auth/logout';

// user roles
export const ROLE_APP_ADMIN = 'appadmin';
export const ROLE_GENERAL_USER = 'generaluser';
export const ROLE_CIPZ_REVIEWER = 'cipz_reviewer';
export const ROLE_CIPZ_SUBMITTER = 'cipz_submitter';
export const ROLE_CIPZ_SUPPORT = 'cipz_support_user';

// user role types
export const ROLE_REGULAR = 'regular';
export const ROLE_CIPZ = 'cipz';

export const MAX_ROLE_HIERARCHY_NUMBER = 10000;

// application constants
export const BETWEEN = 'Between';
export const CRITICAL = 'CRITICAL';
export const IS_APPLICABLE = 'isApplicable';

// misc
export const ORDER_PRICE_TYPE_HAND = 'H';

export const CLOUD_PCI_CLIENT_ID = 'Cloud_PCI';
