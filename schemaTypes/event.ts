import {defineField, defineType} from 'sanity'

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
      options: {
        list: [
          {
            title: 'Formula 1',
            value: 'f1',
          },
          {
            title: 'Six Nations',
            value: 'six-nations',
          },
        ],
      },
    }),
    defineField({
      name: 'f1Details',
      title: 'F1 Details',
      type: 'object',
      hidden: ({parent}) => parent.series !== 'f1',
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
            {
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
            },
          ],
          options: {
            sortable: true,
          },
        }),
      ],
    }),
  ],
})
