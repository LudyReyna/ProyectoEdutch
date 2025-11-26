export default {
  testEnvironment: "node",

  // No usar Babel
  transform: {},

  // Ignorar node_modules COMPLETAMENTE
  transformIgnorePatterns: [
    "/node_modules/"
  ],

  // Ignorar cualquier carpeta "config" que pueda confundir a Jest
  modulePathIgnorePatterns: [
    "<rootDir>/config",
    "<rootDir>/node_modules"
  ],

  // Ruta para los tests
  testMatch: ["**/tests/**/*.test.js"],

  verbose: false
};






