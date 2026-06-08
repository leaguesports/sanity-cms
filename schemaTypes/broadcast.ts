import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'broadcast',
  title: 'Broadcast',
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
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{type: 'series'}],
    }),
    defineField({
      name: 'dateTime',
      title: 'Date Time',
      type: 'datetime',
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'reference',
      to: [{type: 'venue'}],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
  ],
})
