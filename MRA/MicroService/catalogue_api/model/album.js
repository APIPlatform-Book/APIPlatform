var mongoose    =   require("mongoose");

// create instance of Schema
var schema =   mongoose.Schema;

// create schema: more info on http://mongoosejs.com/docs/schematypes.html

var albumSchema  = new schema(
    {
        album_id:   String,
        album_name: String,
        upc: String,
        release_date: String,
        song_count: Number,
        length_seconds: Number,
        artist_name: String,
        songs: [{ type: schema.Types.ObjectId, ref: 'Song' }]
    });

module.exports = mongoose.model('Album',albumSchema);


