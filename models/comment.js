// having a separate comment object is not necessary!!
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  comment:String,
  book: { type: Schema.Types.ObjectId, ref: 'Book' }
})

module.exports = mongoose.model('Comment', commentSchema)
