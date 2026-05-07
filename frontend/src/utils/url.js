const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/400x400?text=No+Image'
  if (url.startsWith('http')) return url
  if (url.startsWith('/images/')) return url // Served by frontend (Vite)
  return `${SERVER_URL}${url}` // Served by backend (for old uploads)
}
