# League Sports — Sanity Studio

Content Studio for [leaguesports.co.za](https://leaguesports.co.za). Schema in this repo is the source of truth for Studio.

## Desk

The sidebar highlights **Guides** as a first-class document list so Content can open and edit Guide docs immediately. Venue, Location, Sport, Series, and Event remain in the same sidebar.

## Local development

```bash
yarn
yarn dev
```

## Redeploy Studio (after merge)

Schema and desk-structure changes only appear in hosted Studio after a Studio deploy. After this PR is merged:

```bash
yarn deploy
# equivalent: npx sanity deploy
```

Do not use MCP `deploy_schema` — local Studio owns the schema.

## Scripts

- `yarn dev` — local Studio
- `yarn build` — production build
- `yarn deploy` — deploy hosted Studio

## Docs

- [Getting started](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)
