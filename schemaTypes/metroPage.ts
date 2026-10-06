import {defineArrayMember, defineField, defineType} from 'sanity'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const UNIQUE_MESSAGE = 'A metro page for this intent, activity, and city already exists.'

const UNIQUENESS_QUERY = `coalesce(count(*[_type == "metroPage" && intent == $intent && activitySlug == $activitySlug && citySlug == $citySlug && !(_id in [$id, $draftId])]), 0)`

export default defineType({
  name: 'metroPage',
  title: 'Metro page',
  type: 'document',
  description:
    'One document per intent + activity + city. Store the public URL slug (f1, not motorsport; johannesburg, not joburg).',
  fields: [
    defineField({
      name: 'intent',
      title: 'Intent',
      type: 'string',
      options: {
        list: [
          {title: 'Play', value: 'play'},
          {title: 'Watch', value: 'watch'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'activitySlug',
      title: 'Activity slug',
      type: 'string',
      description:
        'Sport or watch series slug from the URL: padel, rugby, cricket, soccer, f1, motorsport, premier-league.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          if (!SLUG_PATTERN.test(value)) {
            return 'Use a lowercase slug such as johannesburg, padel, or premier-league'
          }
          return true
        }),
    }),
    defineField({
      name: 'citySlug',
      title: 'City slug',
      type: 'string',
      description: 'Directory city slug: johannesburg, cape-town. Not joburg.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          if (!SLUG_PATTERN.test(value)) {
            return 'Use a lowercase slug such as johannesburg, cape-town, or padel'
          }
          return true
        }),
    }),
    defineField({
      name: 'h1',
      title: 'H1',
      type: 'string',
      description: 'Visible heading. Leave empty to keep the templated heading.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'array',
      description: '2–3 short paragraphs. One plain-text paragraph per item.',
      of: [defineArrayMember({type: 'text', rows: 4, title: 'Paragraph'})],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'bestFor',
      title: 'Best for',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metroPageFaq',
          title: 'FAQ',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              description: 'Plain text. Inline links use label.',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'relatedLinks',
      title: 'Related links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'metroPageLink',
          title: 'Link',
          fields: [
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              description: 'Site path such as /guides/best-padel-courts-joburg or /events.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'ogTitle', title: 'OG title', type: 'string'}),
        defineField({name: 'ogDescription', title: 'OG description', type: 'text', rows: 3}),
      ],
    }),
  ],
  validation: (rule) =>
    rule.custom(async (doc, context) => {
      const intent = typeof doc?.intent === 'string' ? doc.intent.trim() : ''
      const activitySlug = typeof doc?.activitySlug === 'string' ? doc.activitySlug.trim() : ''
      const citySlug = typeof doc?.citySlug === 'string' ? doc.citySlug.trim() : ''
      if (!intent || !activitySlug || !citySlug) return true
      const id = (context.document?._id ?? '').replace(/^drafts\./, '')
      const client = context.getClient({apiVersion: '2026-03-08'})
      const existing = await client.fetch(UNIQUENESS_QUERY, {
        intent,
        activitySlug,
        citySlug,
        id,
        draftId: id ? `drafts.${id}` : 'drafts.',
      })
      if (existing == null || existing === 0) return true
      return UNIQUE_MESSAGE
    }),
  preview: {
    select: {intent: 'intent', activitySlug: 'activitySlug', citySlug: 'citySlug', h1: 'h1'},
    prepare({intent, activitySlug, citySlug, h1}) {
      const title = [intent, activitySlug, citySlug]
        .map((part) => (typeof part === 'string' ? part.trim() : ''))
        .filter(Boolean)
        .join(' · ')
      const heading = typeof h1 === 'string' ? h1.trim() : ''
      return {title: title || heading || 'Metro page', subtitle: heading}
    },
  },
})
