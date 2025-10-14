import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get current module directory in ES Modules environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load swagger.yaml using absolute path
const swaggerDocument = YAML.load(join(__dirname, "swagger.yaml"));

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
