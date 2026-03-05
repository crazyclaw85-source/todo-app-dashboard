'use client';

import { useMemo } from 'react';
import type { NavItem } from '@/types';

/**
 * Simple hook that returns navigation items as-is.
 * Can be extended later with filtering logic.
 */
export function useFilteredNavItems(items: NavItem[]) {
  return useMemo(() => items, [items]);
}
