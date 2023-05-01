export default () => {
  const { PORT, APP_NAME, API_DOMAIN, WEBSITE_DOMAIN, API_VERSION } =
    process.env;

  return {
    port: parseInt(PORT ?? '3000', 10),
    appName: APP_NAME ?? '',
    apiDomain: API_DOMAIN ?? '',
    apiVersion: API_VERSION ?? '',
    websiteDomain: WEBSITE_DOMAIN ?? '',
  };
};
