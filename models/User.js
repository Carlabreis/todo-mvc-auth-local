const bcrypt = require('bcrypt') //enables us to change a password to a $ version and back
const mongoose = require('mongoose')
// schemas are just constructor functions
const UserSchema = new mongoose.Schema({  // to create a new user
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String
})


// Password hash middleware.

 UserSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})


// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}


module.exports = mongoose.model('User', UserSchema)
