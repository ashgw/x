export function formatDate(date: string) {
  let currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

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

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `${fullDate} (${formattedDate})`;
}

function isSameMonthAndYear(inputDate: string): boolean {
  const currentDate = new Date();
  const inputDateObj = new Date(inputDate);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const inputMonth = inputDateObj.getMonth();
  const inputYear = inputDateObj.getFullYear();

  return currentMonth === inputMonth && currentYear === inputYear;
}

const inputDateString = '2024-02-20T09:15:00-0400';
const result = isSameMonthAndYear(inputDateString);
console.log(result);
