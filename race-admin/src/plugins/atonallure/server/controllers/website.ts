import "@strapi/strapi";

export default ({ strapi }) => ({
  async getApiToken(ctx) {
    if (!["staging", "test"].includes(process.env.NODE_ENV)) {
      return ctx.notFound();
    }
    const name = "website-apitoken";
    
    let [apiToken] = await strapi.service("admin::api-token").findMany({ filters: { name } });
    if (!apiToken) {
      apiToken = await strapi.service("admin::api-token").create({
        name: "website-apitoken",
        description: "API Token for testing the API",
        type: "full-access",
        lifespan: 7 * 24 * 60 * 60 * 1000,
      });
    }
    ctx.body = apiToken;
  },
});
