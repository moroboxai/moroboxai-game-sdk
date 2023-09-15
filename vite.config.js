import { defineConfig } from "vite";
const { resolve } = require("path");

export default defineConfig({
    build: {
        outDir: resolve(__dirname, "lib"),
        lib: {
            entry: resolve(__dirname, "src", "index.ts"),
            name: "MoroboxAIGameSDK",
            formats: ["cjs", "umd"],
            fileName: (format) => {
                switch (format) {
                    case "cjs":
                        return `cjs/index.cjs`;
                    case "umd":
                        return `umd/moroboxai-game-sdk.min.js`;
                }
            }
        }
    }
});
