import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'sanity-test',

  projectId: '4m59yeu0',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    productionUrl: async (prev, context) => {
      const {document} = context
      if (document._type === 'guide') {
        const slug = (document as {slug?: {current?: string}}).slug?.current
        if (slug) {
          return `https://leaguesports.co.za/guides/${slug}`
        }
      }
      return prev
    },
  },
})
