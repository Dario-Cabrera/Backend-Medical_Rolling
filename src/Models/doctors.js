const {Schema,model} = require ("mongoose")

const DoctorModel = new Schema({
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
    specialty: {
        type: String, 
        require:true, 
        },
    LicenceNumber: {
        type: Number, 
        require:true, 
        },
    isDoctor: {
        type: Boolean, 
        require:true, 
        },    
    appointment:{
        type: Object
    },
    //Estos son los turnos, que tiene asignado el medico.
});

module.exports = model ("doctors",DoctorModel);