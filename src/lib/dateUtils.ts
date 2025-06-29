import { parse, format } from "date-fns";

export function formatDate(dateStr: string) {
  const parsedDate = parse(dateStr, "yyyy/mm/dd", new Date());
  return { date: parsedDate.getDate(), day: format(parsedDate, "EEEE") };
}
