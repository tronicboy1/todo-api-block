import { UserConfigExport, defineConfig } from "vite";
import { ngi18n } from "rollup-plugin-ng-i18n";

export const baseConfig: UserConfigExport = {
  build: {
    outDir: "./build",
    lib: {
      entry: ["src/index.ts"],
      formats: ["es"],
    },
    rollupOptions: {
      external: [/^lit/, "rxjs"],
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  plugins: [
    ngi18n({
      translate: {
        translationFilePaths: ["./locale/ja.json", "./locale/es.json"],
        translationFileLocales: ["ja", "es"],
      },
      sourceLocale: "en",
    }),
  ],
});
