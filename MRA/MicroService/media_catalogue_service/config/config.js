module.exports = {
    server: {
        port: process.env.PORT || 3000
    },
    db: {
        connectString: process.env.MONGODB_URI || "mongodb://mongodb:27017/catalogue_db"
    }

};