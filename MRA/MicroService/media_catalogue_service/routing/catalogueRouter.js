const express = require('express');

module.exports = function (catalogueController) {
    var router = express.Router();

    router.route('/catalogue/artists')
        //.get(catalogueController.searchArtists)
        .post(catalogueController.createArtists);

    router.route('/catalogue/artists/:artistId')
        .get(catalogueController.getArtist)

    router.route('/catalogue/songs')
        .post(catalogueController.createSongs);

    router.route('/catalogue/songs/:songId')
        .get(catalogueController.getSongs);

    router.route('/catalogue/albums')
        .post(catalogueController.createAlbums);

    return router;
};
