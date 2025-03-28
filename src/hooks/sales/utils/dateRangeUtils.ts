
import { DateRange } from '../types';

/**
 * Converts a period string to a DateRange object
 * @param period The period ('day', 'week', 'month', 'year')
 * @returns DateRange object with from and to dates
 */
export function periodToDateRange(period: 'day' | 'week' | 'month' | 'year'): DateRange {
  const now = new Date();
  const to = now;
  let from: Date;
  
  switch (period) {
    case 'day':
      from = new Date();
      from.setHours(0, 0, 0, 0);
      break;
    case 'week':
      from = new Date();
      from.setDate(from.getDate() - 7);
      break;
    case 'month':
      from = new Date();
      from.setMonth(from.getMonth() - 1);
      break;
    case 'year':
      from = new Date();
      from.setFullYear(from.getFullYear() - 1);
      break;
    default:
      from = new Date();
      from.setMonth(from.getMonth() - 1); // Default to last month
  }
  
  return { from, to };
}

/**
 * Determines if a value is a DateRange object
 * @param value The value to check
 * @returns True if the value is a DateRange object
 */
export function isDateRange(value: any): value is DateRange {
  return value && (value.from !== undefined || value.to !== undefined);
}
