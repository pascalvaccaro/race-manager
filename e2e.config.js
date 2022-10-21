module.exports = {
  apps: [{
    name: "e2e:backend",
    cwd: "./race-admin",
    script: "./node_modules/.bin/strapi",
    args: "start",
    autorestart: false,
    env: {
      DATABASE_FILENAME: "./.tmp/cypress.db",
      NODE_ENV: 'test',
    }
  }, {
    name: "e2e:frontend",
    cwd: "./race-website",
    interpreter: "/usr/bin/bash",
    script: "pnpm",
    args: "run preview",
    restart_delay: 2500,
  }, {
    name: "cypress",
    script: 'npm',
    args: "run e2e:open",
    autorestart: false,
    env: {
      CYPRESS_BASE_URL: 'http://localhost:4173'
    }
  }]
}
