'use client';

import { useLangStore } from '@/store/langStore';
import { getT } from '@/lib/i18n';

export function useT() {
  const lang = useLangStore((s) => s.lang);
  return getT(lang);
}
