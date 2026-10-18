// SVG output must match across V8 (SSR/Chrome) and JavaScriptCore (Safari).
export const svgNumber = (value: number) => Math.round(value * 1000) / 1000
