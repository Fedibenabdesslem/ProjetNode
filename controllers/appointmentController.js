const Appointment = require("../models/Appointment");
// Create a new appointment
const createAppointment = async (req, res) => {
    const { name, email, phone, department, doctor, date, message } = req.body;

    try {
        const newAppointment = new Appointment({
            name,
            email,
            phone,
            department,
            doctor,
            date,
            message,
            status: "scheduled", // Default status
            created_at: Date.now()
        });

        await newAppointment.save();

        res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


// 📌 Récupérer tous les rendez-vous (Admin)
const getAllAppointments = async (req, res) => {
    try {
        // Vérifier que l'utilisateur est un admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs" });
        }

        const appointments = await Appointment.find().populate("client professional", "name email");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous", error: error.message });
    }
};

// 📌 Récupérer les rendez-vous d'un utilisateur (client ou professionnel)
const getUserAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        // Vérifier que l'utilisateur est un client ou un professionnel
        if (role !== "client" && role !== "professional") {
            return res.status(403).json({ message: "Accès refusé. Réservé aux clients et professionnels" });
        }

        let query = {};
        if (role === "client") query.client = userId; // Fetch appointments for the logged-in client
        if (role === "professional") query.professional = userId; // Fetch appointments for the logged-in professional

        // Populate client and professional details
        const appointments = await Appointment.find(query)
            .populate("client", "name email") // Populate client details
            .populate("professional", "name email"); // Populate professional details

        res.status(200).json({ appointments });
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// 📌 Modifier un rendez-vous (ex: changer la date)
const updateAppointment = async (req, res) => {
    try {
        const { date, status } = req.body;
        const appointmentId = req.params.id;

        // Vérifier que la date est valide et dans le futur
        if (date) {
            const appointmentDate = new Date(date);
            if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) {
                return res.status(400).json({ message: "Date invalide ou passée" });
            }
        }

        // Vérifier que l'utilisateur est autorisé à modifier ce rendez-vous
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Rendez-vous introuvable" });
        }

        if (req.user.role === "client" && appointment.client.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce rendez-vous" });
        }

        if (req.user.role === "professional" && appointment.professional.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce rendez-vous" });
        }

        // Mettre à jour le rendez-vous
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { date, status },
            { new: true }
        ).populate("client professional", "name email");

        res.json({ message: "Rendez-vous mis à jour", appointment: updatedAppointment });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du rendez-vous", error: error.message });
    }
};

// 📌 Supprimer un rendez-vous
const deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Vérifier que l'utilisateur est autorisé à supprimer ce rendez-vous
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Rendez-vous introuvable" });
        }

        if (req.user.role === "client" && appointment.client.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce rendez-vous" });
        }

        if (req.user.role === "professional" && appointment.professional.toString() !== req.user.id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce rendez-vous" });
        }

        await Appointment.findByIdAndDelete(appointmentId);
        res.json({ message: "Rendez-vous supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du rendez-vous", error: error.message });
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
