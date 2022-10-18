export default ({ env }) => ({
  config: {
    importOnBootstrap: false,
    customTypes: [],
    excludedConfig: [
      "core-store.plugin_strapi-stripe_stripeSetting",
      "core-store.plugin_users-permissions_grant",
    ],
  },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"),
      },
      settings: {
        defaultFrom: "atonallure@gmail.com",
        defaultReplyTo: "atonallure@gmail.com",
      },
    },
  },
});
