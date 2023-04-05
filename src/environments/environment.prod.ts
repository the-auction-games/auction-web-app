export const environment = {
  production: true,
  sidecarHost: process.env['SIDECAR_HOST'] || 'api.the-auction-games.com',
  sidecarPort: process.env['SIDECAR_PORT'] || 443
};
