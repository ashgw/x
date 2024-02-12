export function formatDate(date: string): string {
  const currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = 'Today';
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `${fullDate} (${formattedDate})`;
}

export function isSameMonthAndYear(inputDate: string): boolean {
  const currentDate = new Date();
  const inputDateObj = new Date(inputDate);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const inputYear = inputDateObj.getFullYear();
  const inputMonth = inputDateObj.getMonth();

  return currentYear === inputYear && currentMonth === inputMonth;
}
