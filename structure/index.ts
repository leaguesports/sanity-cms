import type {StructureResolver} from 'sanity/structure'

const HIGHLIGHTED_TYPES = ['guide']

/**
 * Explicit Guides list for Studio UI. The `guide` type is already in schema;
 * this only highlights it in the desk. Other types stay on the default lists.
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
