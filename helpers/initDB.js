import mongoose from "mongoose";

function initDB() {
    if (mongoose.connections[0].readyState) {
        console.log("already Connection");
        return
    }
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    mongoose.connection.on('connected', () => {
        console.log("connection to mongo")
    })
    mongoose.connection.on('error', (err) => {
        console.log("error while connecting", err)
    })
}

export default initDB;