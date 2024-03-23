const mongoose = require ("mongoose")

const dbConnect = async () => {
    try{
        await mongoose.connect("mongodb+srv://<username>:<password>@cluster0.feo7poy.mongodb.net/")
        console.log("Conexión exitosa")
    }catch(e){
        console.log ("Error",e)
    }
    
    
}

module.exports = dbConnect