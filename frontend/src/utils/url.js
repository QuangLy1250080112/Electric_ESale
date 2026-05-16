const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/400x400?text=No+Image'
  
  const encodedUrl = encodeURI(url);
  
  if (encodedUrl.startsWith('http')) return encodedUrl
  
  // Images starting with /images/ are served from the frontend public directory
  if (encodedUrl.startsWith('/images/')) return encodedUrl
  
  return `${SERVER_URL}${encodedUrl}`
}
