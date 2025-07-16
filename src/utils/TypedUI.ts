import * as uiReact from 'tinybase/ui-react/with-schemas';
import { NoTablesSchema } from 'tinybase/with-schemas';
import { valuesSchema } from './schemas';

const TypedUI = uiReact as uiReact.WithSchemas<[NoTablesSchema, typeof valuesSchema]>

export default TypedUI;
