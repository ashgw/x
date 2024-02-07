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
