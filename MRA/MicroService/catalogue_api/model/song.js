var mongoose    =   require("mongoose");

// create instance of Schema
var schema =   mongoose.Schema;

// create schema: more info on http://mongoosejs.com/docs/schematypes.html

var songSchema  = new schema(
    {   song_name: String,
        song_id: String,
        isrc: String,
        release_date: String,
        audio: {
                "format": String,
                "lenght_seconds": Number
            },
        video: {
                "format": String,
                "lenght_seconds": Number
            }
    });

module.exports = mongoose.model('Song',songSchema);




