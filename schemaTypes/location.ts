import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'type',
      title: 'Location Type',
      type: 'string',
      options: {
        list: [
          {
            title: 'City',
            value: 'city',
          },
          {
            title: 'Suburb',
            value: 'suburb',
          },
        ],
      },
      initialValue: 'suburb',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Location (e.g., The City this Suburb is in)',
      type: 'reference',
      to: [{type: 'location', options: {filter: 'type == "city"'}}],
      // Only show this field if it's a Suburb
      hidden: ({document}) => document?.type !== 'suburb',
    }),
  ],
})
