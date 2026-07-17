import type { AccessibilityItem, NearbyDestination, ScoreItem } from '@/types/destination';

export function scoreToPercent(score: ScoreItem['score']): number {
  return score * 20;
}

export function nearbyMetadata(item: NearbyDestination): string {
  return [item.distance, item.travelTime, item.relation].filter(Boolean).join(' · ');
}

export function accessibilityLabel(status: AccessibilityItem['status']): string {
  return { available: 'Available', partial: 'Partial', unavailable: 'Unavailable', unknown: 'Unknown' }[status];
}
