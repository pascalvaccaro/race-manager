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
    args: "run preview --mode test",
    restart_delay: 2500,
    env: {
      NODE_ENV: 'production'
    }
  }, {
    name: "cypress",
    script: 'npm',
    autorestart: false,
    args: "run e2e:open",
    env: {
      FRONTEND_URL: 'http://localhost:4173'
    }
  }]
}
