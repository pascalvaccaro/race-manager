import "@strapi/strapi";

export default ({ strapi }) => ({
  async findAssetsToValidate(ctx) {
    const files = await strapi.entityService.findMany("plugin::upload.file", { populate: 'related' });
    ctx.body = files.filter(file => file.valid === null);
  },

  async validateAsset(ctx) {
    const asset = await strapi.entityService.update('plugin::upload.file', ctx.params.id, ctx.request.body);
    ctx.body = asset;
  }
});
