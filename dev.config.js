module.exports = {
  apps: [{
    name: "dev:backend",
    cwd: "./race-admin",
    script: "./node_modules/.bin/strapi",
    args: "develop",
  }, {
    name: "dev:frontend",
    cwd: "./race-website",
    interpreter: "/usr/bin/bash",
    script: "pnpm",
    args: "run dev",
  }]
}
