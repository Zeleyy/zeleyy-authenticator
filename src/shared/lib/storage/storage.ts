import { load } from "@tauri-apps/plugin-store";

// @TODO: typing doesn't work
// interface StorageData {
//     theme: string;
//     language: string;
// }

const defaultSettings = {
    theme: "dark",
    language: "ru",
    pageAnimations: true,
};

export const storage = await load("config.json", {
    autoSave: true,
    defaults: defaultSettings
});