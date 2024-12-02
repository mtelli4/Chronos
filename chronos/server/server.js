const express = require('express');
const app = express();
const path = require('path');
const db = require('./models');
const {Sequelize} = require('sequelize');
var cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('ingrid', process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: '127.0.0.1',
    dialect: 'mysql',
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });

app.listen(5000, () => {
    console.log("listening on port 5000")
})

// Définit un répertoire statique pour servir les fichiers PDF
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const moduleCoursRouter = require('./routes/ModuleCours')
app.use("/modules", moduleCoursRouter)

const coursRouter = require('./routes/Cours')
app.use("/cours", coursRouter)

const notesRouter = require('./routes/Notes')
app.use("/notes", notesRouter)

const utilisateursRouter = require('./routes/Utilisateur')
app.use("/utilisateurs", utilisateursRouter)

const secretairesRouter = require('./routes/Secretaire')
app.use("/secretaires", secretairesRouter)

const elevesRouter = require('./routes/Eleve')
app.use("/eleves", elevesRouter)

const professeursRouter = require('./routes/Professeur')
app.use("/professeurs", professeursRouter)

const formationsRouter = require('./routes/Formation')
app.use("/formations", formationsRouter)

const periodesRouter = require('./routes/Periode')
app.use("/periodes", periodesRouter)

const statutsRouter = require('./routes/Statut')
app.use("/statut", statutsRouter)

const evaluationsRouter = require('./routes/Evaluations')
app.use("/evaluations", evaluationsRouter)

const usersEAVrouter = require('./routes/UtilisateursEAV')
app.use("/usersEAV", usersEAVrouter)

// Redirection/route pour backend Login (analyse email et mdp)
const loginRouter = require('./routes/Login')
app.use("/login", loginRouter)

const newPasswordRouter = require('./routes/newPassword')
app.use("/newpsw", newPasswordRouter)

// Redirection/route pour backend getEleveCours (récupération des élèves du cours)
const getEleveCoursRouter = require('./routes/getEleveCours')
app.use("/eleve_cours", getEleveCoursRouter)

// Redirection/route pour backend insertAbsences (insertion d'absences d'élèves pour un cours)
const addAbsencesAndPresencesRouter = require('./routes/addAbsencesAndPresences')
app.use("/end_call", addAbsencesAndPresencesRouter)

// Redirection/route pour backend getAbsences (récupère les absences d'un élève)
const getEleveAbsenceRouter = require('./routes/getEleveAbsence')
app.use("/eleve_absence", getEleveAbsenceRouter)

// Redirection/route pour backend addJustificationWithFile (ajout de justification à une absence)
const addJustificationWithFileRouter = require('./routes/setJustificationWithFile')
app.use("/add_justification_file", addJustificationWithFileRouter)

// Redirection/route pour backend setJustificationWithoutFile (ajout de justification à une absence)
const addJustificationRouter = require('./routes/setJustificationWithoutFile')
app.use("/add_justification", addJustificationRouter)

// Redirection/route pour backend getFormationsSecretary (récupère les formations et élèves sous la charge de la secrétaire)
const getFormationsSecretaryRouter = require('./routes/getFormationsSecretary')
app.use("/secretary_formation", getFormationsSecretaryRouter)

// Redirection/route pour backend setValidAbsence (valider l'absence d'un élève)
const setValidAbsenceRouter = require('./routes/setValidAbsence')
app.use("/set_valid_absence", setValidAbsenceRouter)

// Redirection/route pour backend getProfessorsSecretary (récupère les professeurs liés à la secrétaire)
const getProfessorsSecretaryRouter = require('./routes/getProfessorsSecretary')
app.use("/secretary_professor", getProfessorsSecretaryRouter)

// Redirection/route pour backend getProfessorPresences (récupère le nombre d'heures de présences aux cours d'un professeur)
const getProfessorPresencesRouter = require('./routes/getProfessorPresences')
app.use("/professor_presences", getProfessorPresencesRouter)

const apiRouter = require('./routes/api')
app.use("/api", apiRouter)

const getMessageRouter = require('./routes/Message')
app.use("/messages", getMessageRouter)

app.use(express.json({limit: "25mb"}));
app.use(express.urlencoded({limit: "25mb"}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
