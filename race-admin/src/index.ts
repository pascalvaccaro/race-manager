import fetch from "node-fetch";
import { fillDatabaseWithNextRace } from "./seed";

const { NODE_ENV } = process.env;

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
    if (NODE_ENV === "test" || NODE_ENV === "staging") {
      await fillDatabaseWithNextRace(strapi).catch(err => {
        strapi.log.error(err.message);
        // Inside PM2
        if (typeof process.send === "function") process.exit(3);
      });
    }
  },
};
