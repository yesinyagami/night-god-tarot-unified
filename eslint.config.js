import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import * as parserVue from 'vue-eslint-parser'
import configTypescript from '@vue/eslint-config-typescript'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...configTypescript(),
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: parserVue
    }
  },
  {
    files: ['*.js', '**/*.js', '*.ts', '**/*.ts', '*.vue', '**/*.vue'],
    ignores: ['dist/**', 'node_modules/**', '*.config.*']
  }
]