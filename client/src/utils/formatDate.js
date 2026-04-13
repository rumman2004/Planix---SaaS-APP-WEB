/**
 * Formats an ISO string into a human-readable date.
 * Example Output: "April 13, 2026"
 */
export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats an ISO string into a human-readable time.
 * Example Output: "2:30 PM"
 */
export const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Formats an ISO string to work with standard HTML <input type="datetime-local" />
 * This adjusts for the local timezone so the input displays the correct time.
 * Example Output: "2026-04-13T14:30"
 */
export const formatForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  
  // Adjust for local timezone offset
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date - offset)).toISOString().slice(0, 16);
  
  return localISOTime;
};