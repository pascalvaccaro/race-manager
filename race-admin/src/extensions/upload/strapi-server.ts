export default (plugin) => {
  const contentType = plugin.contentTypes.file;
  if (!contentType.lifecycles) contentType.lifecycles = {};

  contentType.lifecycles.beforeCreate = (event) => {
    const { name } = event.params.data;

    if (name.startsWith("certificate-")) {
      const expiredAt = new Date();
      expiredAt.setFullYear(expiredAt.getFullYear() + 1);
      event.params.data.expiredAt = expiredAt.toISOString();
    }
  };

  contentType.lifecycles.beforeUpdate = async (event) => {
    const {
      params: { data, where },
    } = event;
    const file = await plugin.services
      .upload({ strapi })
      .findOne(where.id, { folder: true });
    if (!file || !file.folder) return;

    const hasNoParent = /^\/\d+$/.test(file.folder.path);
    if (!hasNoParent || file.folder.id === data.folder) return;

    const folderStructure = await plugin.services.folder.getStructure();

    event.params.data.valid = folderStructure
      .filter((f) => ["Certificats", "Autorisations"].includes(f.name))
      .map((f) => f.id)
      .includes(data.folder);
  };

  return plugin;
};
