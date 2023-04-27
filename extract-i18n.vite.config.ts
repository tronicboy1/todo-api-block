import { defineConfig } from "vite";
import { baseConfig } from "./vite.config";
import { ngi18n } from "rollup-plugin-ng-i18n";

export default defineConfig({
  ...baseConfig,
  plugins: [
    ngi18n({
      extract: { localeOutput: "messages.json", format: "json" },
      sourceLocale: "en",
    }),
  ],
});
