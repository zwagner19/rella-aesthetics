import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // NOTE (Wave 3): this previously read `src/**/*.test.ts`, which silently
    // EXCLUDED every `.test.tsx` file. A component suite that is never
    // discovered manufactures false confidence — the same defect cost a full
    // review cycle in rella-booking. `napa-botox-config.test.ts` guards it.
    include: ["src/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
