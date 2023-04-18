export default () => {
  const { PORT, APP_NAME, API_DOMAIN, WEBSITE_DOMAIN } = process.env;

  return {
    port: parseInt(PORT, 10) || 3000,
    appName: APP_NAME,
    apiDomain: API_DOMAIN,
    websiteDomain: WEBSITE_DOMAIN,
  };
};
