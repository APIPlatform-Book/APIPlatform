var Artist   =   require("../model/artist.js");
var Album    =   require("../model/album.js");
var Song     =   require("../model/song.js");

module.exports.searchArtists = function (request,response) {
    var message = {};
    var limitRecords = request.limit || 10;

    //both name and country are provided in this case use and clause otherwise or.
    //Please note that genre is not included until confirmed in the API Design.
    if(request.name !== undefined && request.country !== undefined ) {
        subquery = {
            $and: [
                {'artist_name': request.name},
                {'country': request.country}]
        }

    } else if (request.name !== undefined || request.country !== undefined) {
        subquery = {
            $or: [
                {'artist_name': request.name},
                {'country': request.country}]
        }

    };

    //The populate function automatically updated the reference of albums as part of the artist schema
    //and the songs of part of the albums schema.
    var query = Artist.find(subquery).populate({
        "path": "albums",
        "model": "Album",
        "populate": {
            path: 'songs',
            model: "Song"
        }
    }).limit(limitRecords)

    query.exec(function (err, artist) {
        var object = [];
        // Mongo command to fetch all data from collection.
        if(err) {
            message = {"error" : true,"message" : "Error fetching data"};
        } else {
            //return nothing in case no record can be found.
            if (artist.toString() != []){

                response(artist);
            } else {
                response(artist);
            }
        }

    });

}

module.exports.getArtist = function (request,response) {

    var query = Artist.find({"artist_id" : request},{'_id' : 0}).populate({
        "path": "albums",
        "model": "Album",
        "populate": {
            path: 'songs',
            model: "Song"
        }
    })

    query.exec(function (err, artist) {
        var object = [];
        // Mongo command to fetch all data from collection.
        if(err) {
            message = {"code" : "ERR01","message" : "Unexpected error. " + err};
            //For the purpose of the book any errors are currently not logged
            //to a separate file.
            console.log(message);
            response(message);
        } else {
            //return a warning code in case no record can be found.
            if (artist.toString() != []){
                response(artist);
            } else {
                message = {"code" : "WRN01","message" : "The artist does not exist."};
                response(message);
            }
        }
    });
}

module.exports.createArtists = function (request,response) {

    var artist = new Artist({
        artist_id: request.artist_id,
        artist_name: request.artist_name,
        country: request.country,
        bio: request.bio,
        genres: request.genres,
        albums: []
    });

    console.log(request.artist_id);
    // Save the new model instance, passing a callback
    artist.save(function (err) {
        if (err) return handleError(err);

    });

    var artistMessage = {message: "saved successfully"};

    console.log(artistMessage);
    response(artistMessage);

}

module.exports.updateArtists = function (request,response) {


    if (request.albums[0]._id != undefined) {
        //The database unique id of the artist is not provided in the request. This needs to be found first
        console.log('there is no artist_id');
    }

    //Add songs to the existing songs array of entity Album. If the array already exist then don't update
    //again or add a new resource. The $addToSet in combination with $each enforces this logic.
    Artist.update({"artist_id" : request.artist_id},
        { $addToSet: {albums: { $each: [request.albums[0]._id] }}},
        { upsert: false }
        ,callback);

    //The async callback can also be captured by defining a separate callback function as below.
    function callback (err, numAffected) {
        // numAffected is the number of updated documents
        response(numAffected);
    };
}


module.exports.createAlbums = function (request,response) {
    var mongoose = require('mongoose');
    var album_seq_id = mongoose.Types.ObjectId();

    var album = new Album({
        _id: album_seq_id,
        album_name: request.album_name,
        album_id: request.album_id,
        upc: request.upc,
        release_date: request.release_date,
        song_count: request.song_count,
        length_seconds: request.length_seconds,
        songs: []
    });

    console.log(request.album_id);
    // Save the new model instance, passing a callback
    album.save(function (err) {
        if (err) return handleError(err);
        //saved successfully

    });

    var artistMessage = {artist_name: request.artist.artist_name,
        artist_id: request.artist.artist_id,
        albums: [{_id: album_seq_id}]}

    response(artistMessage);

}

module.exports.updateAlbums = function (request,response) {


    //Add songs to the existing songs array of entity Album. If the array already exist then don't update
    //again or add a new resource. The $addToSet in combination with $each enforces this logic.
    Album.update({"album_id" : request.album_id},
        { $addToSet: {songs: { $each: [request.songs[0]._id] }}},
        { upsert: false }
    ,callback);

    //The async callback can also be captured by defining a separate callback function as below.
    function callback (err, numAffected) {
        // numAffected is the number of updated documents
        response(numAffected);
    };
}

module.exports.createSongs = function (request,response) {

    var mongoose = require('mongoose');

    var song_seq_id = mongoose.Types.ObjectId();
    var song = new Song({ _id: song_seq_id,
                          song_name: request.song_name,
                          song_id: request.song_id,
                          isrc: request.isrc,
                          release_date: request.release_date,
                          audio: {
                                  format: request.audio.format,
                                  lenght_seconds: request.audio.lenght_seconds
                              },
                          video: {
                              format: request.video.format,
                              lenght_seconds: request.video.lenght_seconds,
                          }
                         });

    // Save the new model instance, passing a callback
    song.save(function (err) {
        if (err) return handleError(err);

    });

    var album = { album_id: request.album.album_id,
                  songs: [{_id: song_seq_id}]}

    response(album);


}

selfgetSongs = module.exports.getSongs = function (song_id,show_id,response) {

    Song.find({"song_id" : song_id},{'_id' : show_id},function (err, song){
        //console.log('getSong test2' + song_id + show_id);
        if(err) {
            message = {"error" : true,"message" : "Error fetching data"};
        } else {

            //return nothing in case no record can be found.
            if (song.toString() != []){
                //console.log('test1');
                console.log('provide song response');
                response(song);
            } else {
                response(song);

            }
        }
    });

}