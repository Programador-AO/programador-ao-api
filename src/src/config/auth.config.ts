import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';

export default () => {
  const {
    APP_NAME,
    API_DOMAIN,
    WEBSITE_DOMAIN,
    SUPERTOKENS_API_BASEPATH,
    SUPERTOKENS_WEBSITE_BASEPATH,
    SUPERTOKENS_CONNECTION_URI,
    SUPERTOKENS_API_KEY,

    CLIENT_CREDENTIALS_GOOGLE_CLIENT_ID,
    CLIENT_CREDENTIALS_GOOGLE_CLIENT_SECRET,

    CLIENT_CREDENTIALS_GITHUB_CLIENT_ID,
    CLIENT_CREDENTIALS_GITHUB_CLIENT_SECRET,

    CLIENT_CREDENTIALS_APPLE_CLIENT_ID,
    CLIENT_CREDENTIALS_APPLE_CLIENT_SECRET_KEY_ID,
    CLIENT_CREDENTIALS_APPLE_CLIENT_SECRET_PRIVATE_KEY,
    CLIENT_CREDENTIALS_APPLE_CLIENT_SECRET_TEAM_ID,

    CLIENT_CREDENTIALS_FACEBOOK_CLIENT_ID,
    CLIENT_CREDENTIALS_FACEBOOK_CLIENT_SECRET,
  } = process.env;

  const info = {
    appInfo: {
      appName: APP_NAME,
      apiDomain: API_DOMAIN,
      websiteDomain: WEBSITE_DOMAIN,
      apiBasePath: SUPERTOKENS_API_BASEPATH,
      websiteBasePath: SUPERTOKENS_WEBSITE_BASEPATH,
    },
    connectionURI: SUPERTOKENS_CONNECTION_URI,
    apiKey: SUPERTOKENS_API_KEY,
  };

  const recipeList = [
    ThirdPartyEmailPassword.init({
      providers: [
        // ThirdPartyEmailPassword.Google({
        //   clientId: CLIENT_CREDENTIALS_GOOLE_CLIENT_ID,
        //   clientSecret: CLIENT_CREDENTIALS_GOOLE_CLIENT_SECRET,
        // }),
        // ThirdPartyEmailPassword.Github({
        //   clientSecret: CLIENT_CREDENTIALS_GITHUB_CLIENT_ID,
        //   clientId: CLIENT_CREDENTIALS_GITHUB_CLIENT_SECRET,
        // }),
        // ThirdPartyEmailPassword.Apple({
        //   clientId: CLIENT_CREDENTIALS_APPLE_CLIENT_ID,
        //   clientSecret: {
        //     keyId: CLIENT_CREDENTIALS_APPLE_CLIENT_SECRET_KEY_ID,
        //     privateKey: CLIENT_CREDENTIALS_APPLE_CLIENT_SECRET_PRIVATE_KEY,
        //     teamId: CLIENT_CREDENTIALS_APPLE_CLIENT_SECRET_TEAM_ID,
        //   },
        // }),
        // ThirdPartyEmailPassword.Facebook({
        //   clientSecret: CLIENT_CREDENTIALS_FACEBOOK_CLIENT_ID,
        //   clientId: CLIENT_CREDENTIALS_FACEBOOK_CLIENT_SECRET,
        // }),
      ],
    }),
  ];

  return { info, recipeList };
};
