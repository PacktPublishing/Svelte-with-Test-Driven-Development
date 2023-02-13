import { expect } from 'vitest';
import * as matchers from 'svelte-component-double/vitest';

expect.extend(matchers);

import { componentDouble } from 'svelte-component-double';

globalThis.componentDouble = componentDouble;
