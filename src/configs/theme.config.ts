import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    globalCss: {
        body: {
            backgroundColor: "#F7FAFC",
            color: "#2E3192",
            _dark: {
                backgroundColor: "#1A202C",
                color: "{colors.white}",
            },
        },
    },
    theme: {
        tokens: {
            colors: {
                brand: {
                    navy: { value: "#2E3192" },
                    orange: { value: "#F47920" },
                    navyLight: { value: "#3F42A5" },
                    lightGray: { value: "#F7F7F7" }
                },
                test: {
                    value: "pink"
                },
                accent: {
                    DEFAULT: {
                        value: "#F47920", // Use brand orange as accent
                    },
                    50: { value: "#FFF5EB" },
                    100: { value: "#FEEBC8" },
                    200: { value: "#FBD38D" },
                    300: { value: "#F6AD55" },
                    400: { value: "#ED8936" },
                    500: { value: "#F47920" }, // Main orange
                    600: { value: "#DD6B20" },
                    700: { value: "#C05621" },
                    800: { value: "#9C4221" },
                    900: { value: "#7B341E" },
                },
            },

            fonts: {
                heading: { value: "Oak Sans, sans-serif" },
                body: { value: "Oak Sans, sans-serif" },
            },
        },
        semanticTokens: {
            colors: {
                accent: {
                    solid: {
                        value: "{colors.accent.600}", // main solid color for buttons, etc.
                    },
                    muted: {
                        value: "{colors.accent.400}", // lighter for hover or subtle accents
                    },
                    subtle: {
                        value: "{colors.accent.100}", // for light backgrounds
                    },
                    contrast: {
                        value: "{colors.accent.50}", // strong contrast areas
                    },
                    fg: {
                        value: "{colors.accent.700}", // text accent color
                    },
                    emphasized: {
                        value: "{colors.accent.800}", // stronger emphasis (headings, etc.)
                    },
                    focusRing: {
                        value: "{colors.accent.500}", // focus outlines, inputs, etc.
                    },
                },
                border: {
                    default: {
                        value: {
                            base: "{colors.gray.200}",
                            _dark: "{colors.gray.200}",
                        },
                    },
                },
            },
        },
    },
});

const themeSystem = createSystem(defaultConfig, config);
export default themeSystem;