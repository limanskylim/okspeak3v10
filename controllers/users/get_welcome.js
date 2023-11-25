const getWelcome = (userId) => {
  const users = require('../../data/users.json')
  const user = users.find(user => user.id == userId)
  if (user) {
    return `Hi, ${user.name}! 🥰`
  } else {
    return ''
  }
}

module.exports = getWelcome