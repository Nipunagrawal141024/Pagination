 const mongoose = require('mongoose');
 var Schema = mongoose.Schema;
const AuthorSchema = new Schema({
    name: String,
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});
module.exports= mongoose.model('Author', AuthorSchema);