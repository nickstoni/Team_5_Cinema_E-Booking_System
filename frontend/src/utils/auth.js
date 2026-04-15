export function isAuthenticated() {
  return Boolean(localStorage.getItem('cinemaAuth') || localStorage.getItem('userId'));
}