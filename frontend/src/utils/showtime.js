export function formatRoomNumber(roomName) {
  if (!roomName) return 'TBD';

  return String(roomName).replace(/^room\s*/i, '').trim() || 'TBD';
}

export function formatShowtimeLabel(showtime) {
  if (!showtime) return 'Showtime details unavailable';

  const dateLabel = showtime.showdate ? new Date(showtime.showdate).toDateString() : 'Unknown date';
  const timeLabel = showtime.showtime || 'Unknown time';
  const roomLabel = formatRoomNumber(showtime.showroomName);

  return `${dateLabel} • ${timeLabel} • ${roomLabel}`;
}
