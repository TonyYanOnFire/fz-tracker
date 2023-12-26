import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

import monkey, {cdn} from 'vite-plugin-monkey'
import {trackerVersion} from './src/config.js'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(), 
		monkey({
			entry: 'src/main.js',
			userscript: {
				name: 'FZ Tracker',
				namespace: 'https://github.com/TonyYanOnFire/fz-tracker',
				supportURL: 'https://github.com/TonyYanOnFire/fz-tracker/issues',
				version: trackerVersion,
				icon: 'https://external-content.duckduckgo.com/ip3/f95zone.to.ico',
				match: ['https://f95zone.to/threads/*'],
				author: 'TonyYanOnFire',
				description: 'Track the versions of games you have finished on F95Zone.',
			}, build: {

				externalGlobals: [
					[
						'vue',
						cdn
							.unpkg('Vue', 'dist/vue.global.prod.js')
							.concat('https://unpkg.com/@vueuse/shared@10.7.0/index.iife.min.js')],
					[
						'@vueuse/core',
						cdn.unpkg('VueUse', 'index.iife.js'),
					]
				]
			},
		}), 
		AutoImport({
			imports: ['vue', '@vueuse/core'],
			eslintrc: {
				enabled: true,
			}
		}),
	],
	resolve: {
		alias: {
			'@': '/src',
		},
	},
})
