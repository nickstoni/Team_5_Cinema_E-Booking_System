export function formatTime12Hour(timeString) {
  if (!timeString) return '';

  const [hours, minutes] = String(timeString).split(':');
  const hour = parseInt(hours, 10);
  const minute = minutes || '00';

  if (Number.isNaN(hour)) return '';

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${hour12}:${minute} ${period}`;
}