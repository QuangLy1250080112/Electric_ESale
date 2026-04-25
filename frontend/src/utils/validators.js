export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const validatePhone = (phone) => {
  const re = /^(\+84|0)[0-9]{9,10}$/
  return re.test(phone)
}
