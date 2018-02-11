var hal = require('hal');
var halson = require('halson');

module.exports = function (data) {
    var controller = {};

    controller.createArtists = function (request, response) {

        data.createArtists(request.body,function(resultCreate){

            response.header("Content-Type", "application/json");
            response.status(201);
            response.send();
            /*if(resultCreate.message != undefined){
                response.status(201);
                response.send();

            } else {
                response.status(400);
                var message = responseMessage("ERR02","The artist failed to be created.");
                response.send(message);
            }*/
        })

    }

    controller.searchArtists = function (request, response) {
        var limit = parseInt(request.query.limit);

        var artistName = request.query.name;
        var country = request.query.country;
        var genre = request.query.genre;

        data.searchArtists({"limit": limit,"name": artistName,"country": country,"genre": genre},function(result){

            if (result != undefined) {

                //response.header("Content-Type", "application/json");
                response.json({"artists": result});

                //the album is referenced in the mongodb and this information need to be fetched separately.

            } else {
                //404 is not found
                response.header("Content-Type", "application/json");
                response.status(404);
                response.send();
            }

        });
    }

    controller.getArtist = function (request, response) {

        console.log(request.params.artistId);

        data.getArtist(request.params.artistId,function(result){

            var index;
            var albums;

            try{

                //Loop through each album and songs to include HAL and to capture
                //the fields required in the JSON response to the client i.e. the MongoDB document version field is not returned.
                for (index = 0; index < result[0].albums.length; ++index) {

                    var songArray = {};
                    songArray = [];
                    var i;

                    //First loop through the songs per album
                    for (i = 0; i < result[0].albums[index].songs.length; ++i) {

                        //Create a song halson resource that support json objects and HAL.
                        var resourceSong = halson({
                            song_name: result[0].albums[index].songs[i].song_name,
                            song_id: result[0].albums[index].songs[i].song_id,
                            isrc: result[0].albums[index].songs[i].isrc,
                            release_date: result[0].albums[index].songs[i].release_date
                        })
                            .addLink('self', '/v1/catalogue/songs/' + result[0].albums[index].songs[i].song_id)
                            .addLink('audio',{format: result[0].albums[index].songs[i].audio.format,
                                lenght_seconds: result[0].albums[index].songs[i].audio.length_seconds,
                                href:'/v1/catalogue/songs/' + result[0].albums[index].songs[i].song_id + '/audio?format=' + result[0].albums[index].songs[i].audio.format})
                            .addLink('video',{format: result[0].albums[index].songs[i].video.format,
                                lenght_seconds: result[0].albums[index].songs[i].video.length_seconds,
                                href:'/v1/catalogue/songs/' + result[0].albums[index].songs[i].song_id + '/audio?format=' + result[0].albums[index].songs[i].video.format})
                            .addLink('lyrics',{href: '/v1/catalogue/songs/' + result[0].albums[index].songs[i].song_id + '/lyrics'} )

                        //push the halson object into the song array
                        songArray.push(resourceSong);

                    } //for (i = 0; i < result[0].albums[index].songs.length; ++i)


                    var album = {} // empty Object
                    album = []; // empty Array, which you can push() values into

                    var resourceAlbum = halson({album_name: result[0].albums[index].album_name,
                        album_id: result[0].albums[index].album_id,
                        upc: result[0].albums[index].upc,
                        release_date: result[0].albums[index].release_date,
                        song_count: result[0].albums[index].song_count,
                        length_seconds: result[0].albums[index].length_seconds,
                        Songs: songArray
                    })
                        .addLink('self', '/v1/catalogue/albums/' + result[0].albums[index].album_id)

                    album.push(resourceAlbum);

                } //end (index = 0; index < result[0].albums.length; ++index)

                var resource = halson({
                    artist_name: result[0].artist_name,
                    artist_id: result[0].artist_id,
                    country: result[0].country,
                    bio: result[0].bio,
                    genres: result[0].genres,
                    'albums': album

                })
                    .addLink('self', '/v1/catalogue/artists/' + result[0].artist_id)
                    .addLink('albums', '/v1/catalogue/artists/' + result[0].artist_id + '/albums')
                    .addLink('genres', '/v1/catalogue/artists/' + result[0].artist_id + '/genres')

                response.header("Content-Type", "application/json");
                response.status(200);
                response.send(JSON.stringify(resource));

            } catch(e) {
                //For the purpose of the book any errors are currently not logged
                //to a separate file.
                if (result.code.match(/WRN.*/)) {
                    response.status(400);
                    response.send(result);
                } else if (result.code.match(/ERR.*/)) {
                    response.status(500);
                    var message = responseMessage(result.code,"Unexpected error occurred. Please contact your system administrator.");
                    response.send(result);

                }
            }

        });
    }

    controller.createAlbums= function (request, response) {
        result = [];

        data.createAlbums(request.body,function(resultCreate){
            console.log('albums sander');

            data.updateArtists(resultCreate,function(resultUpdate){
                console.log('Album successfully created');

                console.log(resultUpdate.ok);

                if(resultUpdate.ok == 1){
                    response.header("Content-Type", "application/json");
                    response.status(201);
                    response.send();

                } else {
                    response.header("Content-Type", "application/json");
                    response.status(400);
                    var message = responseMessage("ERR03","The album could not be added to an existing Artist.");
                    response.send(message);
                    //The album is created without any reference to an Artist as such could call a delete operation.
                }

            })

        })

    }

    controller.createSongs = function (request, response) {

        console.log('test1');

        data.createSongs(request.body,function(resultSong){
            console.log('Add the created Song to the related Album');
            console.log(resultSong);

            //response.json(result);
            data.updateAlbums(resultSong,function(responseAlbum){
                console.log('Song successfully created');

                console.log(responseAlbum.ok);

                if(responseAlbum.ok == 1){
                    response.header("Content-Type", "application/json");
                    response.status(201);
                    response.send();

                } else {
                    response.header("Content-Type", "application/json");
                    response.status(400);
                    var message = responseMessage("ERR01","The song could not be added to an existing Album.");
                    response.send(message);
                    //The song is created without any reference as such could call a delete operation.
                }

            })
        });

    }

    controller.getSongs = function (request, response) {

        data.getSongs(request.params.songId,0,function(songs){
            console.log(response);
            response.header("Content-Type", "application/json");
            response.status(200);
            response.json(songs);

        });
    }

    function responseMessage (code,description){
        var message = {"code": code
                      ,"message": description};
        return message;

    }
    return controller;
}