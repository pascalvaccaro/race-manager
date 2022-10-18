export default ({ env }) => ({
  atonallure: {
    enabled: true,
    resolve: "./src/plugins/atonallure",
  },
  "config-sync": {
    enabled: true,
    config: {
      importOnBootstrap: ["test", "staging"].includes(env("NODE_ENV")),
      customTypes: [
        { configName: "api-token", queryString: "admin::api-token", uid: "name" },
      ],
      excludedConfig: [
        "core-store.plugin_strapi-stripe_stripeSetting",
        "core-store.plugin_users-permissions_grant",
      ],
    },
  },
  'strapi-stripe': {
    enabled: true,
    resolve: "./src/plugins/stripe",
  },
});
