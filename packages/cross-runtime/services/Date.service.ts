export class DateService {
  static formatDate({ stringDate }: { stringDate: string }): string {
    if (!stringDate || typeof stringDate !== "string") {
      throw new Error("Invalid date: must be a non-empty string");
    }

    const normalizedDateString = stringDate.includes("T")
      ? stringDate
      : `${stringDate}T00:00:00`;
    const targetDate = new Date(normalizedDateString);

    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date format: unable to parse");
    }

    const now = new Date();

    const yearsDiff = now.getFullYear() - targetDate.getFullYear();
    let monthsDiff = now.getMonth() - targetDate.getMonth() + yearsDiff * 12;
    let daysDiff = now.getDate() - targetDate.getDate();

    if (daysDiff < 0 && monthsDiff > 0) {
      monthsDiff--;
      daysDiff += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    } else if (daysDiff > 0 && monthsDiff < 0) {
      monthsDiff++;
      daysDiff -= new Date(now.getFullYear(), now.getMonth() - 1, 0).getDate();
    }

    let relative = "";
    if (monthsDiff >= 12) {
      const years = Math.floor(monthsDiff / 12);
      const remainingMonths = monthsDiff % 12;
      relative =
        remainingMonths === 0
          ? `${years}y ago`
          : `${years}y ${remainingMonths}mo ago`;
    } else if (monthsDiff > 0) {
      relative = `${monthsDiff}mo ago`;
    } else {
      const totalDaysDiff = Math.floor(
        (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      relative = totalDaysDiff > 0 ? `${totalDaysDiff}d ago` : "Today";
    }

    const fullDate = targetDate.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return `${fullDate} (${relative})`;
  }

  static isSameMonthAndYear({ stringDate }: { stringDate: string }): boolean {
    if (!stringDate || typeof stringDate !== "string") {
      throw new Error("Invalid date: must be a non-empty string");
    }

    const targetDate = new Date(stringDate);
    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date format: unable to parse");
    }

    const now = new Date();
    return (
      now.getFullYear() === targetDate.getFullYear() &&
      now.getMonth() === targetDate.getMonth()
    );
  }
}
