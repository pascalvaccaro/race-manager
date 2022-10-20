import { fillDatabaseWithNextRace, createWebsiteToken } from "./seed";

const { NODE_ENV, IS_PULL_REQUEST, STRAPI_WEBSITE_TOKEN } = process.env;

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      if (STRAPI_WEBSITE_TOKEN) {
        const accessKey = strapi.service("admin::api-token").hash(STRAPI_WEBSITE_TOKEN);
        await createWebsiteToken(strapi, accessKey);
      }
      if (NODE_ENV === "test" || IS_PULL_REQUEST === "true") {
        await fillDatabaseWithNextRace(strapi);
      }
    } catch (err) {
      strapi.log.error(err.message);
      // Inside PM2
      if (typeof process.send === "function") process.exit(3);
      
    }
  },
};
