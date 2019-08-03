import { readFileSync } from 'fs-extra';
import { join } from 'path';

export default JSON.parse(
  readFileSync(join(__dirname, 'order.json'), 'utf8')
) as string[];
