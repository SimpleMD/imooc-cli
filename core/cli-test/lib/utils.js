'use strict';
import { pathExistsSync } from 'path-exists';

export function exists(p) {
  return pathExistsSync(p);
}
