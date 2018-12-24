/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const Book = require('../models/book')

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: 'new book title' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body.title, 'new book title');
          Book.findOneAndDelete({ title: 'new book title' }).then(b=>{}) // DB cleanup
          done();
        });
        
      })
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title: '' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'title missing');
          done();
        });
      })
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const book = new Book({ title: 'new book' })
        chai.request(server)
        .get('/api/books/' + book.id)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });    
      })        
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const book = new Book({ title: 'new book' })
        book.save()
        .then(book => {
          chai.request(server)
          .get('/api/books/' + book.id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, book.id);
            assert.equal(res.body.title, 'new book');
            assert.isArray(res.body.comments);
            Book.findByIdAndDelete(book.id).then(b=>{}) //cleanup
            done();
          });
        })        
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const book = new Book({ title: 'new book' })
        book.save()
        .then(book => {
          chai.request(server)
          .post('/api/books/' + book.id)
          .send({ comment: 'new comment' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, book.id);
            assert.equal(res.body.title, 'new book');
            assert.equal(res.body.comments[0], 'new comment');
            Book.findByIdAndDelete(book.id).then(b=>{}) //cleanup
            done();
          });
        })
      });
      
    });

  });

});
