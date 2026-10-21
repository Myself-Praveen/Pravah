export interface Holiday {
  date: string; // 'YYYY-MM-DD'
  regionId?: string | null;
  label: string;
}

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isHoliday(d: Date, holidays: Holiday[] = [], regionId?: string | null): boolean {
  const key = formatDateKey(d);
  return holidays.some(h => h.date === key && (h.regionId == null || h.regionId === regionId));
}

export function isWorkingDay(d: Date, holidays: Holiday[] = [], regionId?: string | null): boolean {
  return !isWeekend(d) && !isHoliday(d, holidays, regionId);
}

/**
 * Calculates number of working days between start and end (exclusive of start, inclusive of end if working day)
 */
export function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[] = [],
  regionId?: string | null
): number {
  if (endDate <= startDate) return 0;

  let count = 0;
  const current = new Date(startDate.getTime());
  current.setHours(0, 0, 0, 0);

  const target = new Date(endDate.getTime());
  target.setHours(0, 0, 0, 0);

  while (current < target) {
    current.setDate(current.getDate() + 1);
    if (isWorkingDay(current, holidays, regionId)) {
      count++;
    }
  }

  return count;
}

/**
 * Adds workingDays to a given startDate taking weekends and holidays into account
 */
export function addWorkingDays(
  startDate: Date,
  workingDays: number,
  holidays: Holiday[] = [],
  regionId?: string | null
): Date {
  const result = new Date(startDate.getTime());
  let daysAdded = 0;

  while (daysAdded < workingDays) {
    result.setDate(result.getDate() + 1);
    if (isWorkingDay(result, holidays, regionId)) {
      daysAdded++;
    }
  }

  return result;
}

/**
 * Compute SLA consumed percentage
 */
export function computeSlaPercentage(
  stageEntryDate: Date,
  currentDate: Date,
  prescribedWorkingDays: number,
  pausedWorkingDays: number = 0,
  holidays: Holiday[] = [],
  regionId?: string | null
): number {
  if (prescribedWorkingDays <= 0) return 0;
  const elapsedWorkingDays = calculateWorkingDays(stageEntryDate, currentDate, holidays, regionId);
  const netWorkingDays = Math.max(0, elapsedWorkingDays - pausedWorkingDays);
  const percentage = (netWorkingDays / prescribedWorkingDays) * 100;
  return Math.round(percentage * 10) / 10;
}

/**
 * Map SLA percentage to color state
 */
export function getSlaStateFromPercentage(pct: number, isPaused: boolean = false): 'GREEN' | 'AMBER' | 'RED' | 'CRITICAL' | 'PAUSED' {
  if (isPaused) return 'PAUSED';
  if (pct >= 125) return 'CRITICAL';
  if (pct >= 100) return 'RED';
  if (pct >= 75) return 'AMBER';
  return 'GREEN';
}
