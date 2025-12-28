import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// add plugin for code coverage
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()
    , istanbul({
      include: 'app/**/*',
      exclude: ['node_modules', 'tests/', 'twd-tests/', 'public/'],
      extension: ['.ts', '.tsx'],
    })
  ],
});
