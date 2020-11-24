const GET = 'get';
const POST = 'post';
const DELETE = 'delete';
const version = '/v1';
const appName = '/pci-bff';

const routes = [
  { path: '/', method: GET },
  { path: '/support/healthcheck', method: GET},
  { path: '/batch/signed-url/{source}', method: POST },
  { path: '/batch/files/{source}', method: GET },
  { path: '/batch/files/{source}/{prefix}', method: GET },
  { path: '/batch/files/{source}', method: DELETE },
  { path: '/auth/login', method: GET },
  { path: '/auth/logout', method: GET },
  { path: '/auth/user-details', method: GET },
  { path: '/pricing/pricing-data', method: POST },
];

module.exports = () => {
  const output = [];
  let route = null;
  routes.forEach((r) => {
    route = {
      http: { path: version + appName + r.path, method: r.method, cors: true },
    };
    output.push(route);
  });
  return output;
};
