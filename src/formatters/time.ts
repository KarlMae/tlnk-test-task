import { differenceInMinutes, formatDistanceStrict } from 'date-fns'

export function formatTimeAgo(date: Date, now: Date): string {
  if (differenceInMinutes(now, date) < 1) {
    return 'less than a minute ago'
  }
  return formatDistanceStrict(date, now, { addSuffix: true, roundingMethod: 'floor' })
}
