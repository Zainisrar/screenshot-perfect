const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface DeadlineFormats {
  notice: string;
  utc: string;
  png: string;
}

function formatUtc(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const time = `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
  return `${day}-${month}-${year} ${time} UTC`;
}

export function formatTenderDeadline(notice: string, utcOffset: number): DeadlineFormats {
  const match = notice.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})\s+(\d{2}):(\d{2})/);
  if (!match) throw new Error(`Unsupported deadline notice: ${notice}`);
  const [, dayText, monthText, yearText, hourText, minuteText] = match;
  const month = MONTHS.findIndex((item) => item.toLowerCase() === monthText.toLowerCase());
  if (month < 0) throw new Error(`Unsupported month in deadline notice: ${notice}`);

  const utcDate = new Date(
    Date.UTC(Number(yearText), month, Number(dayText), Number(hourText) - utcOffset, Number(minuteText)),
  );
  const pngDate = new Date(utcDate.getTime() + 10 * 60 * 60 * 1000);
  return { notice, utc: formatUtc(utcDate), png: `${formatUtc(pngDate).replace(" UTC", " PNG")}` };
}

export function daysUntilDeadline(notice: string, utcOffset: number, now = new Date()): number {
  const formatted = formatTenderDeadline(notice, utcOffset);
  const match = formatted.utc.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})\s+(\d{2}):(\d{2})/);
  if (!match) return 0;
  const [, day, monthText, year, hour, minute] = match;
  const month = MONTHS.findIndex((item) => item.toLowerCase() === monthText.toLowerCase());
  const deadline = Date.UTC(Number(year), month, Number(day), Number(hour), Number(minute));
  return Math.ceil((deadline - now.getTime()) / 86_400_000);
}