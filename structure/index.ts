import type {StructureResolver} from 'sanity/structure'

const HIGHLIGHTED_TYPES = ['guide']

/**
 * First-class Guides list so Content can open and edit Guide docs immediately.
 * Remaining document types stay reachable via the default type lists.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Guides')
        .id('guides')
        .schemaType('guide')
        .child(S.documentTypeList('guide').title('Guides')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !HIGHLIGHTED_TYPES.includes(listItem.getId() ?? ''),
      ),
    ])
