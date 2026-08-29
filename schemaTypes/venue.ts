import {defineField, defineType} from 'sanity'

/**
 * Field names for site-facing data match landing-page GROQ in
 * `src/services/venueQuery.ts` (hero_image, phone, whatsapp, website, lat/lng,
 * amenities, claim_status, upcoming_screenings, is_verified, rating, etc.).
 *
 * Watch = broadcasts (sports shown on screens).
 * Play = sports (sports visitors can play at the venue).
 */
export default defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'watchPlay', title: 'Watch & Play'},
    {name: 'amenities', title: 'Amenities'},
    {name: 'location', title: 'Location'},
    {name: 'listing', title: 'Listing'},
    {name: 'seo', title: 'SEO'},
  ],
  fieldsets: [
    {
      name: 'contact',
      title: 'Contact',
      options: {columns: 2},
    },
    {
      name: 'coordinates',
      title: 'Map coordinates',
      options: {columns: 2},
    },
    {
      name: 'amenityFlags',
      title: 'Amenities',
      options: {columns: 2},
    },
    {
      name: 'claim',
      title: 'Claim & verification',
      options: {columns: 2},
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'overview',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'hero_image',
      title: 'Hero image',
      type: 'image',
      group: 'overview',
      description: 'Primary photo for the venue page and directory cards.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      group: 'overview',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'overview',
      fieldset: 'contact',
      description:
        'Public phone. The site prefers WhatsApp for enquire/book CTAs when that is set.',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      group: 'overview',
      fieldset: 'contact',
      description: 'Preferred for enquire/book CTAs. GROQ also reads nested contactInfo.whatsapp.',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      group: 'overview',
      fieldset: 'contact',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Additional contact',
      type: 'object',
      group: 'overview',
      description:
        'GROQ still reads contactInfo.phone and contactInfo.whatsapp. Prefer the Contact fields above for new venues; WhatsApp is used for CTAs when set.',
      fields: [
        defineField({name: 'phone', title: 'Phone Number', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'string'}),
        defineField({name: 'whatsapp', title: 'WhatsApp Number', type: 'string'}),
      ],
    }),
    defineField({
      name: 'broadcasts',
      title: 'Watch (broadcasts)',
      type: 'array',
      group: 'watchPlay',
      description:
        'Watch = sports this venue shows on screens (broadcasts). These appear as Watch on the site.',
      of: [{type: 'reference', to: {type: 'sport'}}],
    }),
    defineField({
      name: 'sports',
      title: 'Play (sports)',
      type: 'array',
      group: 'watchPlay',
      description:
        'Play = sports visitors can play at this venue. These appear as Play on the site.',
      of: [{type: 'reference', to: {type: 'sport'}}],
    }),
    defineField({
      name: 'has_generator_backup',
      title: 'Generator / inverter backup',
      type: 'boolean',
      group: 'amenities',
      fieldset: 'amenityFlags',
      initialValue: false,
    }),
    defineField({
      name: 'has_big_screens',
      title: 'HD big screens',
      type: 'boolean',
      group: 'amenities',
      fieldset: 'amenityFlags',
      initialValue: false,
    }),
    defineField({
      name: 'has_live_audio',
      title: 'Live commentary on',
      type: 'boolean',
      group: 'amenities',
      fieldset: 'amenityFlags',
      initialValue: false,
    }),
    defineField({
      name: 'has_craft_drafts',
      title: 'Draft beer',
      type: 'boolean',
      group: 'amenities',
      fieldset: 'amenityFlags',
      initialValue: false,
    }),
    defineField({
      name: 'has_food_menu',
      title: 'Food menu',
      type: 'boolean',
      group: 'amenities',
      fieldset: 'amenityFlags',
      initialValue: false,
    }),
    defineField({
      name: 'has_outdoor_area',
      title: 'Outdoor area',
      type: 'boolean',
      group: 'amenities',
      fieldset: 'amenityFlags',
      initialValue: false,
    }),
    defineField({
      name: 'has_parking',
      title: 'On-site parking',
      type: 'boolean',
      group: 'amenities',
      fieldset: 'amenityFlags',
      initialValue: false,
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'location',
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
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      group: 'location',
      fieldset: 'coordinates',
      description: 'Decimal degrees, e.g. -26.2041 for Johannesburg. Set together with longitude.',
      validation: (Rule) =>
        Rule.min(-90)
          .max(90)
          .custom((lat, context) => {
            const lng = (context.document as {longitude?: number} | undefined)?.longitude
            const hasLat = typeof lat === 'number'
            const hasLng = typeof lng === 'number'
            if (hasLat === hasLng) return true
            return 'Latitude and longitude must both be set'
          }),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      group: 'location',
      fieldset: 'coordinates',
      description: 'Decimal degrees, e.g. 28.0473 for Johannesburg. Set together with latitude.',
      validation: (Rule) =>
        Rule.min(-180)
          .max(180)
          .custom((lng, context) => {
            const lat = (context.document as {latitude?: number} | undefined)?.latitude
            const hasLat = typeof lat === 'number'
            const hasLng = typeof lng === 'number'
            if (hasLat === hasLng) return true
            return 'Latitude and longitude must both be set'
          }),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      group: 'location',
      to: [{type: 'location'}],
    }),
    defineField({
      name: 'is_verified',
      title: 'Verified listing',
      type: 'boolean',
      group: 'listing',
      fieldset: 'claim',
      description:
        'Leave unset unless you are changing verification. Do not default to false — that would overwrite legacy `isVerified` true. The site will use select(defined(is_verified) => is_verified, isVerified).',
    }),
    defineField({
      name: 'claim_status',
      title: 'Claim status',
      type: 'string',
      group: 'listing',
      fieldset: 'claim',
      options: {
        list: [
          {title: 'Unclaimed', value: 'unclaimed'},
          {title: 'Claim pending', value: 'claim_pending'},
          {title: 'Claimed', value: 'claimed'},
        ],
        layout: 'radio',
      },
      initialValue: 'unclaimed',
      // StringRule types omit valid(); runtime Rule supports it.
      validation: (Rule) =>
        (Rule as unknown as {valid: (values: string[]) => typeof Rule}).valid([
          'unclaimed',
          'claim_pending',
          'claimed',
        ]),
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified Hub (legacy)',
      type: 'boolean',
      group: 'listing',
      hidden: true,
      description:
        'Legacy camelCase field. No initialValue so Studio does not write a dead false over existing true. The site will use select(defined(is_verified) => is_verified, isVerified).',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      group: 'listing',
      description: 'Optional public rating (0–5) shown on the venue page.',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'crowdLevel',
      title: 'Crowd Level (%)',
      type: 'number',
      group: 'listing',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'upcoming_screenings',
      title: 'Upcoming screenings',
      type: 'array',
      group: 'listing',
      description: 'Watch fixtures this venue is showing. Field names match site GROQ.',
      of: [
        {
          type: 'object',
          name: 'screening',
          title: 'Screening',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'startsAt',
              title: 'Starts at',
              type: 'datetime',
              description: 'ISO datetime. The site also accepts a free-form display string.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'setupTags',
              title: 'Setup tags',
              type: 'array',
              of: [{type: 'string'}],
              options: {layout: 'tags'},
              description: 'e.g. Big screen, Sound on, Outdoor',
            }),
          ],
          preview: {
            select: {title: 'title', startsAt: 'startsAt'},
            prepare({title, startsAt}) {
              return {
                title: title || 'Screening',
                subtitle: startsAt,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      group: 'seo',
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
  ],
  preview: {
    select: {
      title: 'name',
      media: 'hero_image',
      suburb: 'address.suburb.title',
    },
    prepare({title, media, suburb}) {
      return {
        title: title || 'Untitled venue',
        subtitle: suburb,
        media,
      }
    },
  },
})
