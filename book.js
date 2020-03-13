const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const BookSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Author' },
  title: String,
  pages: Number
});
module.exports= mongoose.model('Book', BookSchema);
  
