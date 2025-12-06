module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
		ecmaFeatures: { jsx: true },
	},
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	extends: [
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended",
		"eslint:recommended",
	],
	plugins: ["@typescript-eslint"],
	rules: {
		// stylistic choices - adjust as you prefer
		"no-unused-vars": "warn",
		"no-console": "off",
		"@typescript-eslint/no-explicit-any": "off",
	},
};
