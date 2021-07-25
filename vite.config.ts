import { resolve } from 'path'
import { lstatSync } from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'

const alias = () => ({
  name: 'element-alias',
  enforce: 'pre',
  resolveId(source: string) {
    if (/^@element-plus\//.test(source)) {
      const path = resolve(__dirname, source.replace(/^@element-plus(.*)/, './packages$1'))

      try {
        const isDirectory = lstatSync(path).isDirectory()

        return path + (isDirectory ? '/index.ts' : '.ts')
      } catch (error) {
        return path + '.ts'
      }
    }
    return null
  },
})

export default defineConfig({
  root: resolve(__dirname, './website'),
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js',
      'element-plus': resolve(__dirname, './packages/element-plus/index.ts'),
      'examples': resolve(__dirname, './website'),
    },
  },
  plugins: [
    alias(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      frontmatter: false,
      // markdownItOptions: {
      //   html: true,
      //   linkify: true,
      //   typographer: true,
      //   highlight,
      // },
    }),
  ],
})
