'use client';

import { CommandPalette } from './CommandPalette';
import { CustomCursor } from './CustomCursor';
import { LoadingSequence } from './LoadingSequence';
import { PageTransition } from './PageTransition';
import { ScrollProgress } from './ScrollProgress';

/**
 * Every always-on, viewport-level layer, mounted once in the root layout.
 * Each piece degrades independently — none of them wrap page content, so a
 * failure in one cannot take the document down with it.
 */
export function SiteChrome() {
  return (
    <>
      <ScrollProgress />
      <PageTransition />
      <CommandPalette />
      <CustomCursor />
      <LoadingSequence />
    </>
  );
}
