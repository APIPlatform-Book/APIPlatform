var mongoose    =   require("mongoose");

// create instance of Schema
var schema =   mongoose.Schema;

// create schema: more info on http://mongoosejs.com/docs/schematypes.html

var artistSchema  = new schema(
    {
        artist_id: String,
        artist_name: String,
        country: String,
        bio: String,
        genres: String,
        albums: [{ type: schema.Types.ObjectId, ref: 'Album' }]
    });

module.exports = mongoose.model('Artist',artistSchema);

