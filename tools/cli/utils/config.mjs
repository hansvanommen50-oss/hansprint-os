/**
 * Hansprint CLI
 * Global Configuration
 */

export const CLI = Object.freeze({
  name: "Hansprint CLI",
  shortName: "hp",

  version: "0.1.0",

  description:
    "Developer toolkit for Hansprint OS.",

  repository:
    "https://github.com/hansprint/hansprint-os",

  author: "Hansprint",

  license: "MIT",

  minimumNode: "22",

  commands: [
    "doctor",
    "verify",
    "governance",
    "release",
    "new"
  ]
});

export default CLI;