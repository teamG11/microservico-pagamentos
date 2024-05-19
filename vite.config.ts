import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      exclude: [
        "**/*.spec.ts", // Exclui especificamente arquivos .spec.ts
        "**/tests/**", // Exclui qualquer coisa dentro de uma pasta tests
        "**/__tests__/**", // Exclui qualquer coisa dentro de uma pasta __tests__
        "src/Infrastructure/lib/prisma.ts",
        "src/Infrastructure/env/index.ts",
      ],
    },
  },
});
