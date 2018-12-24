const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({ // a book has many comments
  title: {
    type: String,
    unique: true
  },
  comments: [String]
  // comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

module.exports = mongoose.model('Book', bookSchema)

