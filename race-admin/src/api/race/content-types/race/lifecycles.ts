export default {
  async afterUpdate(event) {
    const { params, result } = event;
    if (!params.data.publishedAt) return;
    const { startDate } = result;
    await strapi.plugin("upload").service("folder").create({
      name: startDate,
    });
  },
};
