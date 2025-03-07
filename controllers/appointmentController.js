const Appointment = require("../models/Appointment");

// 📌 Créer un rendez-vous
const createAppointment = async (req, res) => {
    try {
        const { professionalId, date } = req.body;
        const clientId = req.user.id;

        const appointment = new Appointment({
            client: clientId,
            professional: professionalId,
            date,
            status: "scheduled"
        });

        await appointment.save();
        res.status(201).json({ message: "Rendez-vous créé avec succès", appointment });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du rendez-vous", error });
    }
};

// 📌 Récupérer tous les rendez-vous (Admin)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate("client professional", "name email");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous", error });
    }
};

// 📌 Récupérer les rendez-vous d'un utilisateur (client ou professionnel)
const getUserAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let query = {};
        if (role === "client") query.client = userId;
        if (role === "professional") query.professional = userId;

        const appointments = await Appointment.find(query).populate("client professional", "name email");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous", error });
    }
};

// 📌 Modifier un rendez-vous (ex: changer la date)
const updateAppointment = async (req, res) => {
    try {
        const { date, status } = req.body;
        const appointmentId = req.params.id;

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { date, status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Rendez-vous introuvable" });
        }

        res.json({ message: "Rendez-vous mis à jour", appointment });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du rendez-vous", error });
    }
};

// 📌 Supprimer un rendez-vous
const deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        await Appointment.findByIdAndDelete(appointmentId);
        res.json({ message: "Rendez-vous supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du rendez-vous", error });
    }
};

// 📌 Export des fonctions
module.exports = {
    createAppointment,
    getAllAppointments,
    getUserAppointments,
    updateAppointment,
    deleteAppointment
};
