import * as chrono from "chrono-node";

export class DateService {
  static formatDate({ stringDate }: { stringDate: string }): string {
    const parsed = chrono.parseDate(stringDate);
    if (!parsed) throw new Error("Invalid date");
    const date = new Date(parsed);
    const now = new Date();
    const yearsDiff = now.getFullYear() - date.getFullYear();
    const monthsDiff = now.getMonth() - date.getMonth();
    const daysDiff = now.getDate() - date.getDate();
    let relative =
      yearsDiff > 0
        ? `${yearsDiff}y ago`
        : monthsDiff > 0
          ? `${monthsDiff}mo ago`
          : daysDiff > 0
            ? `${daysDiff}d ago`
            : "Today";
    return `${date.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })} (${relative})`;
  }

  static isSameMonthAndYear({ stringDate }: { stringDate: string }): boolean {
    const parsed = chrono.parseDate(stringDate);
    if (!parsed) throw new Error("Invalid date");
    const date = new Date(parsed);
    const now = new Date();
    return (
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth()
    );
  }
}
