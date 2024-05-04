import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// eslint-disable-next-line no-undef
	const env = loadEnv(mode, process.cwd());

	console.log(env.VITE_API_URL);

	const API_URL = `${env.VITE_API_URL}`;

	return {
		plugins: [react()],
		server: {
			port: 3000,
			proxy: {
				"/api": {
					target: API_URL,
					changeOrigin: true,
				},
			},
			cors: false,
		},
	};
});
