import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified Hub',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'crowdLevel',
      title: 'Crowd Level (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    // ADDED: Contact details for your WhatsApp/Call bridges
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({name: 'street', title: 'Street', type: 'string'}),
        defineField({
          name: 'suburb',
          title: 'Suburb',
          type: 'reference',
          to: [{type: 'location', options: {filter: 'type == "suburb"'}}],
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'reference',
          to: [{type: 'location', options: {filter: 'type == "city"'}}],
        }),
        defineField({name: 'postcode', title: 'Postcode', type: 'string'}),
        defineField({name: 'province', title: 'Province', type: 'string'}),
        defineField({name: 'country', title: 'Country', type: 'string'}),
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Details',
      type: 'object',
      fields: [
        defineField({name: 'phone', title: 'Phone Number', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'string'}),
        defineField({name: 'whatsapp', title: 'WhatsApp Number', type: 'string'}),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      to: [{type: 'location'}],
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'keywords', title: 'Keywords', type: 'array', of: [{type: 'string'}]}),
        defineField({name: 'author', title: 'Author', type: 'string'}),
        defineField({name: 'image', title: 'Image', type: 'image'}),
        defineField({name: 'ogImage', title: 'OG Image', type: 'image'}),
        defineField({name: 'ogTitle', title: 'OG Title', type: 'string'}),
        defineField({name: 'ogDescription', title: 'OG Description', type: 'text'}),
        defineField({name: 'ogUrl', title: 'OG URL', type: 'url'}),
        defineField({name: 'ogType', title: 'OG Type', type: 'string'}),
        defineField({name: 'ogLocale', title: 'OG Locale', type: 'string'}),
        defineField({name: 'ogSiteName', title: 'OG Site Name', type: 'string'}),
      ],
    }),
    defineField({
      name: 'broadcasts',
      title: 'Broadcasts',
      type: 'array',
      of: [{type: 'reference', to: {type: 'sport'}}],
    }),
    defineField({
      name: 'sports',
      title: 'Sports',
      type: 'array',
      of: [{type: 'reference', to: {type: 'sport'}}],
    }),
  ],
})
