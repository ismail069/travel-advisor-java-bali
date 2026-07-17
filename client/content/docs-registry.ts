import Doc0 from './docs/index.mdx';
import Doc1 from './docs/ai/prompt-library.mdx';
import Doc2 from './docs/components/destination-library.mdx';
import Doc3 from './docs/destination/frontmatter.mdx';
import Doc4 from './docs/destination/template.mdx';
import Doc5 from './docs/developer/folder-structure.mdx';
import Doc6 from './docs/developer/mdx-integration.mdx';
import Doc7 from './docs/editorial/bilingual-guide.mdx';
import Doc8 from './docs/editorial/fact-check.mdx';
import Doc9 from './docs/editorial/writing-standard.mdx';
import Doc10 from './docs/getting-started/introduction.mdx';
import Doc11 from './docs/getting-started/roadmap.mdx';
import Doc12 from './docs/glossary/index.mdx';
import Doc13 from './docs/publishing/checklist.mdx';
import Doc14 from './docs/seo/internal-linking.mdx';
import Doc15 from './docs/seo/metadata.mdx';
import Doc16 from './docs/seo/schema.mdx';

import type { ComponentType } from 'react';

export const docsRegistry: Record<string, ComponentType> = {
  "/docs": Doc0,
  "/docs/ai/prompt-library": Doc1,
  "/docs/components/destination-library": Doc2,
  "/docs/destination/frontmatter": Doc3,
  "/docs/destination/template": Doc4,
  "/docs/developer/folder-structure": Doc5,
  "/docs/developer/mdx-integration": Doc6,
  "/docs/editorial/bilingual-guide": Doc7,
  "/docs/editorial/fact-check": Doc8,
  "/docs/editorial/writing-standard": Doc9,
  "/docs/getting-started/introduction": Doc10,
  "/docs/getting-started/roadmap": Doc11,
  "/docs/glossary": Doc12,
  "/docs/publishing/checklist": Doc13,
  "/docs/seo/internal-linking": Doc14,
  "/docs/seo/metadata": Doc15,
  "/docs/seo/schema": Doc16,
};
