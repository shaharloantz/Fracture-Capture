const Patient = require('../models/Patient');

const checkPatient = async (req, res, next) => {
    const { patientId } = req.body;
    
    try {
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found. Please create a patient first.' });
        }

        // Attach the patient to the request object
        req.patient = patient;
        next();
    } catch (error) {
        console.error('Error checking patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkPatient;
