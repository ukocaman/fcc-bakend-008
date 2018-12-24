/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
// var MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectId;
// const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const Book = require('../models/book')
// const Comment = require('../models/comment')

module.exports = function (app) {

  app.route('/api/books')
    .get((req, res) => {
      Book.find()
      .then(books => {
        res.json(books.map(book => ({_id: book._id, title: book.title, commentcount: book.comments.length})))
      })
      .catch(e => console.log(e))
    }) 
    
    .post((req, res) => {
      const { title } = req.body
      if(!title) {
        res.send('title missing')
      } else {
        Book.findOne({ title })
      .then(book => {
        if(book) { 
          res.send('book already exists')
        } else {
          const book = new Book({ title })
          book.save()
          .then(book => {
            const {_id, title} = book
            res.json({ _id, title })
          })  
        }
      })
      .catch(e => console.log(e))
      }
    })
    
    .delete((req, res) => {
      Book.deleteMany({})
      .then(res.send('complete delete successful'))
      .catch(e => console.log(e))
    });


  app.route('/api/books/:id')
    .get((req, res) => {
      const { id } = req.params
      Book.findById(id)
      // .populate('comments')
      .then(book => {
        if(!book) {
          res.send('no book exists')
        } else {
          const { _id, title, comments } = book    
          res.json({ _id, title, comments })
        }
      })
      .catch(e => console.log(e))
    })
    
    .post((req, res) => {
      const { id } = req.params
      const { comment } = req.body
      Book.findById(id)
      .then(book => {
        // const newComment = new Comment({ comment, book: id })
        // newComment.save()
        // .then(comment => {
        //   book.comments = [...book.comments, comment]
        //   book.save()
        //   .then(book => res.json(book))
        // })
        book.comments = [...book.comments, comment]
        book.save()
        .then(book => {
          const { _id, title, comments } = book
          res.json({ _id, title, comments })
        })
        .catch(e => console.log(e))  
      })
      .catch(e => console.log(e))
    })
    
    .delete((req, res) => {
      const { id } = req.params
      Book.findByIdAndDelete(id)
      .then(book => res.send('delete successful'))
      .catch(e => console.log(e))
    });
  
};
