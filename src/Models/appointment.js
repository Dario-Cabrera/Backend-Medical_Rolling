const {Schema,model} = require ("mongoose")

const AppointmentsModel = new Schema({
    appointmentDate: {
        type: Date, 
        require:true,         
        },
    appointmentTime: {
        type: Date, 
        require:true, 
        },
// No se si se guarda como objeto (Hora y minutos)
})

module.exports = model ("appointments", AppointmentsModel);
