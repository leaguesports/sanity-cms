import {defineArrayMember, defineField, defineType} from 'sanity'

const F1_SERIES = 'f1'

const CRICKET_SERIES = ['cricket', 'sa20']

function isF1Series(series: unknown): boolean {
  return series === F1_SERIES
}

function isCricketSeries(series: unknown): boolean {
  return typeof series === 'string' && CRICKET_SERIES.includes(series)
}

function formatPreviewWhen(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')
}

export default defineType({
  name: 'event',
  title: 'Event',
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
      name: 'series',
      title: 'Series',
      type: 'string',
      description:
        'Catalog key used by the site to infer sport. Keep Formula 1 / Six Nations values; ball-sport slugs match the landing catalog.',
      options: {
        list: [
          {title: 'Formula 1', value: 'f1'},
          {title: 'Six Nations', value: 'six-nations'},
          {title: 'Rugby', value: 'rugby'},
          {title: 'United Rugby Championship', value: 'united-rugby-championship'},
          {title: 'Soccer', value: 'soccer'},
          {title: 'Premier Soccer League', value: 'premier-soccer-league'},
          {title: 'Cricket', value: 'cricket'},
          {title: 'SA20', value: 'sa20'},
        ],
      },
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts at',
      type: 'datetime',
      description:
        'Kickoff (or lights-out). Source of truth for upcoming fixtures. Existing F1 documents may keep using F1 Details → Date Time.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const series = (context.document as {series?: string} | undefined)?.series
          if (series && series !== F1_SERIES && !value) {
            return 'Set kickoff so this fixture can appear on the site. startsAt is the source of truth for non-F1 sports.'
          }
          return true
        }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Editorial flag for homepage hero moments. Data, not presentation.',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Short fixture blurb. Longer F1 copy stays on F1 Details → Description.',
    }),
    defineField({
      name: 'homeTeam',
      title: 'Home team',
      type: 'reference',
      to: [{type: 'team'}],
      hidden: ({parent}) => isF1Series(parent?.series),
    }),
    defineField({
      name: 'awayTeam',
      title: 'Away team',
      type: 'reference',
      to: [{type: 'team'}],
      hidden: ({parent}) => isF1Series(parent?.series),
    }),
    defineField({
      name: 'competition',
      title: 'Competition',
      type: 'string',
      description:
        'Optional display label when series is a sport bucket (e.g. The Rugby Championship). Not a second series system.',
      hidden: ({parent}) => isF1Series(parent?.series),
    }),
    defineField({
      name: 'stadium',
      title: 'Stadium / ground',
      type: 'string',
      description:
        'Match venue name (Ellis Park, Newlands, etc.). CMS venue documents are bars and clubs, not stadiums.',
      hidden: ({parent}) => isF1Series(parent?.series),
    }),
    defineField({
      name: 'kickoffConfirmed',
      title: 'Kickoff confirmed',
      type: 'boolean',
      initialValue: false,
      description: 'Whether startsAt is locked (vs TBC).',
      hidden: ({parent}) => isF1Series(parent?.series),
    }),
    defineField({
      name: 'cricketDetails',
      title: 'Cricket details',
      type: 'object',
      hidden: ({parent}) => !isCricketSeries(parent?.series),
      fields: [
        defineField({
          name: 'format',
          title: 'Format',
          type: 'string',
          options: {
            list: [
              {title: 'T20', value: 't20'},
              {title: 'ODI', value: 'odi'},
              {title: 'Test', value: 'test'},
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'f1Details',
      title: 'F1 Details',
      type: 'object',
      hidden: ({parent}) => parent?.series !== 'f1',
      fields: [
        defineField({
          name: 'description',
          title: 'Description',
          type: 'blockContent',
        }),
        defineField({
          name: 'round',
          title: 'Round',
          type: 'number',
        }),
        defineField({
          name: 'dateTime',
          title: 'Date Time',
          type: 'datetime',
        }),
        defineField({
          name: 'track',
          title: 'Track',
          type: 'string',
        }),
        defineField({
          name: 'laps',
          title: 'Laps',
          type: 'number',
        }),
        defineField({
          name: 'distance',
          title: 'Distance (km)',
          type: 'number',
        }),
        defineField({
          name: 'raceResults',
          title: 'Race Results',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'resultEntry',
              fields: [
                {
                  name: 'position',
                  title: 'Position',
                  type: 'number',
                  validation: (Rule) => Rule.required().min(1).integer(),
                },
                {
                  name: 'driver',
                  title: 'Driver',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'team',
                  title: 'Team / Constructor',
                  type: 'string',
                },
                {
                  name: 'carNumber',
                  title: 'Car Number',
                  type: 'number',
                },
                {
                  name: 'gap',
                  title: 'Gap',
                  type: 'string',
                  description: 'e.g. "+5.234" or "DNF"',
                },
                {
                  name: 'points',
                  title: 'Points',
                  type: 'number',
                },
                {
                  name: 'status',
                  title: 'Status',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Finished', value: 'finished'},
                      {title: 'DNF', value: 'dnf'},
                      {title: 'DSQ', value: 'dsq'},
                      {title: 'DNS', value: 'dns'},
                      {title: 'Other', value: 'other'},
                    ],
                  },
                },
                {
                  name: 'fastestLap',
                  title: 'Fastest Lap',
                  type: 'boolean',
                  initialValue: false,
                },
              ],
              preview: {
                select: {position: 'position', driver: 'driver'},
                prepare({position, driver}) {
                  return {
                    title: `P${position} – ${driver ?? 'TBD'}`,
                  }
                },
              },
            }),
          ],
          options: {
            sortable: true,
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      series: 'series',
      startsAt: 'startsAt',
      f1DateTime: 'f1Details.dateTime',
      featured: 'featured',
    },
    prepare({title, series, startsAt, f1DateTime, featured}) {
      const when = formatPreviewWhen(startsAt) || formatPreviewWhen(f1DateTime)
      const parts = [series, when, featured ? 'Featured' : null].filter(Boolean)
      return {
        title: title || 'Untitled event',
        subtitle: parts.join(' · '),
      }
    },
  },
})
