const {Schema,model} = require ("mongoose")

const UserModel = new Schema({
    name: {
        type: String, 
        require:true, 
        minlength:5,
        maxlength:50
        },
    lastname: {
        type: String, 
        require:true, 
        minlength:5,
        maxlength:50
        },
    email:{
        type: String, 
        require:true,    
    },
    pass: {
        type: String, 
        require:true, 
        minlength:8,
        maxlength:10
        },
    isAdmin: {
        type: Boolean, 
        require:true, 
        },
    isDoctor: {
        type: Boolean, 
        require:true, 
        },    
    appointment:{
        type: Object
    },
    //Estos son los turnos, que serán un objeto que contenga fecha y hora.
});

module.exports = model ("users",UserModel);