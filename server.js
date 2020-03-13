const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Author = require('./author')
const Book = require('./book')

mongoose.connect('mongodb://localhost/paginationn', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', async () => {
  if (await Author.countDocuments().exec() > 0) return // if records are already Present
  const author = new Author({
    _id: new mongoose.Types.ObjectId(),
    name: 'Ian Fleming'
  });

  author.save(function (err) {
    if (err) return handleError(err);
  
    const story1 = new Book({
      title: 'Casino Royale',
      pages:500,
      author: author._id    // assign the _id from the person
    });
    story1.save(function (err) {
      if (err) return handleError(err);
      // thats it!
    });
  });  
  console.log("completed")
//   Promise.all([
//     Author.create({ name: 'Chetan Bhagat'}),   // create is a method which creates a sample user inside our database 
//     Author.create({ name: 'Amrita Pritam'}),
//     Author.create({ name: 'R. K. Narayan'}),
//     Author.create({ name: 'Rabindranath Tagore'}),
//     Author.create({ name: 'Ruskin Bond'})
//   ]).then(() => console.log('Added Users'))

// Promise.all([
//     Book.create({ title:'2 States',page:'100'}),   // create is a method which creates a sample user inside our database 
//     Book.create({ title: 'Pinjar',page:'105'}),
//     Book.create({ title:'The Ramayana',page:'110'}),
//     Book.create({ title:'Gitanjali',page:'120'}),
//     Book.create({ title:'The Blue Umbrella',page:'140'})
//   ]).then(() => console.log('Added Book Data'))
})


app.get('/authors', paginatedResults(Author), (req, res) => {
  res.json(res.paginatedResults)
})

app.get('/books', paginatedResults(Book), (req, res) => {
    res.json(res.paginatedResults)
  })
function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)     //parseInt Convert the String into number
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    var results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results = await model.find()
      // .populate('author')
      .populate('author').limit(limit).skip(startIndex)
      .exec()
      console.log(results)
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
      // console.log(model.populated('Author'))
      // results.results = await model.find().populate('bookId').limit(limit).skip(startIndex).exec()
      // results.results = await model.find().exec()
  }
}
app.listen(3000,()=>{
console.log("Server Started")
})