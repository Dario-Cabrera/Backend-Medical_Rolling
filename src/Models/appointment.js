const {Schema,model} = require ("mongoose")

const AppointmentModel = new Schema({
    Date: {
        type: String, 
        require:true,         
        },
    Time: {
        type: String, 
        require:true, 
        },
// No se si se guarda como objeto (Hora y minutos)
})

module.exports = model ("appointment",AppointmentModel);
