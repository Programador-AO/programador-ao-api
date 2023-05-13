export default () => {
  const {
    PORT,
    APP_NAME,
    API_DOMAIN,
    WEBSITE_DOMAIN,
    API_VERSION,
    EMAIL_SUPORTE,
    LISTA_BRANCA,
    NODE_ENV,
  } = process.env;

  const listaBrancaReplace = LISTA_BRANCA?.replace(/[[\] ]|'/g, '').trim();
  const listaBranca = listaBrancaReplace?.split(',') || [];

  return {
    environment: NODE_ENV ?? 'development',
    port: parseInt(PORT ?? '3000', 10),
    appName: APP_NAME ?? '',
    apiDomain: API_DOMAIN ?? '',
    apiVersion: API_VERSION ?? '',
    websiteDomain: WEBSITE_DOMAIN ?? '',
    emailSuporte: EMAIL_SUPORTE ?? '',
    listaBranca,
  };
};
