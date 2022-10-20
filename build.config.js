module.exports = {
  apps: [{
    name: "build:backend",
    cwd: "./race-admin",
    interpreter: "/usr/bin/bash",
    script: "yarn",
    args: "build",
    autorestart: false,
  }, {
    name: "build:frontend",
    cwd: "./race-website",
    interpreter: "/usr/bin/bash",
    script: "pnpm",
    args: "run build",
    autorestart: false,
  }]
}
