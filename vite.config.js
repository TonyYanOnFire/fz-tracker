import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'

import monkey, {cdn, util} from 'vite-plugin-monkey'
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
        description: 'Track game versions you finished playing on F95Zone.',
        license: 'MIT',
      },
      build: {
        externalGlobals: [
          [
            'vue',
            cdn
              .unpkg('Vue', 'dist/vue.global.prod.js')
              .concat('https://unpkg.com/@vueuse/shared@10.7.0/index.iife.min.js')
              .concat(util.dataUrl(';window.Vue=Vue;')),
          ],
          [
            '@vueuse/core',
            cdn.unpkg('VueUse', 'index.iife.min.js'),
          ],
          [
            'element-plus',
            cdn.unpkg('ElementPlus', 'dist/index.full.min.js'),
          ],
          [
            '@element-plus/icons-vue',
            cdn.unpkg('ElementPlusIconsVue', 'dist/index.iife.min.js'),
          ],
        ],
        externalResource: {
          'element-plus/dist/index.css': cdn.unpkg(),
        },
      },
    }),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      eslintrc: {
        enabled: true,
      },
    }),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
