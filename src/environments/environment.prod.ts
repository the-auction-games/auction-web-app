export const environment = {
  production: true,
  sidecarHost: process.env['SIDECAR_HOST'] || 'localhost',
  sidecarPort: process.env['SIDECAR_PORT'] || 3500
};
