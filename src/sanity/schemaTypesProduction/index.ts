import {type SchemaTypeDefinition} from 'sanity'
import {event} from './event'   // import your new event

export const schemaProduction: { types: SchemaTypeDefinition[] } = {
  types: [event],              // only include the simple schema
}
