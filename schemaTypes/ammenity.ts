import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'ammentity',
  title: 'Ammenities',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
  ],
})
