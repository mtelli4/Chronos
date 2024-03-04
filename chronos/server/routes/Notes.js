const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();

const { Note, Eleve, Formation, ModuleCours, FormationModule,StatutNote, Periode, Evaluation } = require('../models')

router.get("/", async (req, res) => {
  const parameters = req.query
  const profil = parameters.profil
  console.log(parameters)
  if (profil !==null){
    //  0 pour secretaire, 1 pour professeur, 2 pour eleves  
    if (profil.includes('ROLE_SECRETARY')){
      result = await getNotesSecretaire(parameters)
    }
    if (profil.includes('ROLE_PROFESSOR')) {
      result = await getNotesProfesseurs(parameters)
    }
    if (profil.includes('ROLE_USER')) {
      result = await getNotesEleves(parameters)
    }
  }else{
    result = {}
  }
  

  res.json(result);
})


const getNotesEleves = async (parameters) => {
  const notesParameters = {}
  var result = {}
  tmpLstEvaluationsMoyenne = {}
  tmpLstModulesMoyenne = {}

  eleveId = parseInt(parameters.eleveId)

  // Création des filtres pour les requêtes en fonction des paramètres d'appel à l'API
  notesParameters['eleveId'] = eleveId
  if (parameters.hasOwnProperty('periodeId')) {
    notesParameters['$Evaluation.periodeId$'] = parseInt(parameters.periodeId)
  }

  //Récupération de toutes les notes de l'élève actuel
  const notesEleve = await Note.findAll({
    where: notesParameters,
    attributes: ['id','evaluationId']
  })

  //Récupération des notes de tout les élèves pour les évaluations pour lesquelles l'élève actuel à une note
  evaluationIds = notesEleve.map((note) => note.evaluationId);
  const allNotes = await Note.findAll({
    include: [
      {
        model: Evaluation,
        include: {
          model: ModuleCours,
          attributes: ['id', 'libelle'],
        }
      },
      {
        model: StatutNote,
        attributes: ['id', 'libelle'],
      }
    ],
    where: {
      evaluationId: {
        [Op.in]: evaluationIds
      }
    },
    attributes:['id','note','eleveId','evaluationId','statutId']
  })

  //Récupération des informations à afficher concernant les évaluations pour lesquelles l'élève actuel à une note
  result["evaluations"] = await Evaluation.findAll(
    {
      where: {
        id: {
          [Op.in]: evaluationIds
        }
      },
      order: [
        ['id', 'ASC'],
      ],
      attributes:['id','libelle','coefficient','noteMaximale']
    }
  )

  result["modules"] = []

  //Traitement de toutes les notes récupérer pour en extraire les données à renvoyer
  allNotes.forEach(item => {
    const moduleId = item.Evaluation.moduleId;
    const evaluationId = item.Evaluation.id;
    const possedeNote = item.note != null
    const note = parseFloat(item.note);

    if (item.eleveId == eleveId) {
      //Rangement des notes de l'élève par module et par note
      if (!result[moduleId]) {
        result[moduleId] = {};
        result["modules"].push(item.Evaluation.ModuleCour)
      }
      result[moduleId][evaluationId] = { note: note };
      if (item.StatutNote != null) {
        result[moduleId][evaluationId].statut = item.StatutNote.libelle
      }

      //Préparation des données pour calculer la moyenne de l'élève par module
      if (possedeNote) {
        if (!tmpLstModulesMoyenne[moduleId]) {
          tmpLstModulesMoyenne[moduleId] = { note: 0, coefficient: 0 };
        }
        tmpLstModulesMoyenne[moduleId].note += note * Number.parseFloat(item.Evaluation.coefficient) / item.Evaluation.noteMaximale * 20;
        tmpLstModulesMoyenne[moduleId].coefficient += Number.parseFloat(item.Evaluation.coefficient);
      }
    }

    //Préparation des données pour calculer la moyenne dans chaque évaluation
    if (possedeNote) {
      if (!tmpLstEvaluationsMoyenne[evaluationId]) {
        tmpLstEvaluationsMoyenne[evaluationId] = { note: 0, coefficient: 0 };
      }
      tmpLstEvaluationsMoyenne[evaluationId].note += note;
      tmpLstEvaluationsMoyenne[evaluationId].coefficient += 1;
    }
  });

  //Ajout de la moyenne pour chaque évaluation
  result["evaluations"].forEach(item => {
    if (tmpLstEvaluationsMoyenne.hasOwnProperty(item.id)) {
      item.dataValues["moyenne"] = (tmpLstEvaluationsMoyenne[item.id].note / tmpLstEvaluationsMoyenne[item.id].coefficient).toFixed(2)
    } else {
      item.dataValues["moyenne"] = '...'
    }
  })

  //Ajout de la moyenne de chaque module
  result["modules"].forEach(item => {
    if (tmpLstModulesMoyenne.hasOwnProperty(item.id)) {
      item.dataValues["moyenne"] = (tmpLstModulesMoyenne[item.id].note / tmpLstModulesMoyenne[item.id].coefficient).toFixed(2)
    } else {
      item.dataValues["moyenne"] = '...'
    }
  })

  result["modules"].sort((a, b) => a.id - b.id)

  return result
}

const getNotesProfesseurs = async (parameters) => {
  const notesParameters = {}
  const eleveParameters = {}
  const evaluationsParameters = {}
  var result = {}


  // Création des filtres pour les requêtes en fonction des paramètres d'appel à l'API
  if (parameters.hasOwnProperty('moduleId')) {
    notesParameters['$Evaluation.moduleId$'] = parseInt(parameters.moduleId)
    evaluationsParameters['moduleId'] = parseInt(parameters.moduleId)
  }
  if (parameters.hasOwnProperty('formationId')) {
    notesParameters['eleveId'] = parseInt(parameters.formationId)
    eleveParameters['formationId'] = parseInt(parameters.formationId)
  }
  if (parameters.hasOwnProperty('periodeId')) {
    notesParameters['$Evaluation.periodeId$'] = parseInt(parameters.periodeId)
    evaluationsParameters['periodeId'] = parseInt(parameters.periodeId)
  }

  //Récupération de toutes les notes liées à la recherche du professeur
  const listNotes = await Note.findAll({
    include: [
      {
        model: Evaluation,
        required: true,
        attributes:['id','coefficient','noteMaximale']
      },
      {
        model: StatutNote,
        attributes:['id','libelle']
      }
    ],
    where: notesParameters,
    attributes:['id','note','eleveId','evaluationId','statutId']
  })

  //Récupération des informations liées aux élèves concernés par la recherche du professeur
  result["eleves"] = await Eleve.findAll(
    {
      where: eleveParameters,
      order: [
        ['nom', 'ASC'],
        ['prenom', 'ASC'],
      ],
      attributes:['id','nom','prenom','numeroEtudiant','trombinoscope','tiersTemps']
    }
  )
  //Récupération des informations liées aux évaluations concernés par la recherche du professeur
  result["evaluations"] = await Evaluation.findAll(
    {
      where: evaluationsParameters,
      order: [
        ['id', 'ASC'],
      ],
      include: [
        {
          model: Periode,
          required: true,
          attributes:['id','libelle']
        }
      ],
      attributes:['id','libelle','coefficient','noteMaximale']
    }
  )

  tmpLstEleveMoyenne = {}
  tmpLstEvalMoyenne = {}

  //Traitement de toutes les notes récupérer pour en extraire les données à renvoyer
  listNotes.forEach(item => {
    const eleveId = item.eleveId;
    const evaluationId = item.Evaluation.id;
    const possedeNote = item.note != null
    const note = parseFloat(item.note);

    //Rangement des notes par élèves et par évaluations
    if (!result[eleveId]) {
      result[eleveId] = {};
    }
    result[eleveId][evaluationId] = { note: note };
    if (item.StatutNote != null) {
      result[eleveId][evaluationId].statutLibelle = item.StatutNote.libelle
      result[eleveId][evaluationId].statutId = item.StatutNote.id
    }

    if (possedeNote) {
      //Préparation des données pour calculer la moyenne de chaque étudiant
      if (!tmpLstEleveMoyenne[eleveId]) {
        tmpLstEleveMoyenne[eleveId] = { note: 0, coefficient: 0 };
      }
      tmpLstEleveMoyenne[eleveId].note += note * Number.parseFloat(item.Evaluation.coefficient) / item.Evaluation.noteMaximale * 20;
      tmpLstEleveMoyenne[eleveId].coefficient += Number.parseFloat(item.Evaluation.coefficient);

      //Préparation des données pour calculer la moyenne dans chaque évaluation
      if (!tmpLstEvalMoyenne[evaluationId]) {
        tmpLstEvalMoyenne[evaluationId] = { note: 0, coefficient: 0 };
      }
      tmpLstEvalMoyenne[evaluationId].note += note;
      tmpLstEvalMoyenne[evaluationId].coefficient += 1;
    }
  });


  //Ajout de la moyenne de chaque étudiant
  result["eleves"].forEach(item => {
    if (tmpLstEleveMoyenne.hasOwnProperty(item.id)) {
      item.dataValues["moyenne"] = (tmpLstEleveMoyenne[item.id].note / tmpLstEleveMoyenne[item.id].coefficient).toFixed(2)
    } else {
      item.dataValues["moyenne"] = '...'
    }
  })

  //Ajout de la moyenne pour chaque évaluation
  result["evaluations"].forEach(item => {
    if (tmpLstEvalMoyenne.hasOwnProperty(item.id)) {
      item.dataValues["moyenne"] = (tmpLstEvalMoyenne[item.id].note / tmpLstEvalMoyenne[item.id].coefficient).toFixed(2)
    } else {
      item.dataValues["moyenne"] = '...'
    }
  })

  return result
}

const getNotesSecretaire = async (parameters) => {
  const modulesParameters = {}
  const eleveParameters = {}
  const notesParameters = {}
  var result = {}

  // Création des filtres pour les requêtes en fonction des paramètres d'appel à l'API
  if (parameters.hasOwnProperty('formationId')) {
    notesParameters['$Eleve.formationId$'] = parseInt(parameters.formationId)
    eleveParameters['formationId'] = parseInt(parameters.formationId)
    modulesParameters['$Formations.id$'] = parseInt(parameters.formationId)
  }
  if (parameters.hasOwnProperty('periodeId')) {
    notesParameters['$Evaluation.periodeId$'] = parseInt(parameters.periodeId)
  }

  //Récupération de toutes les notes liées à la recherche du secrétaire
  const listNotes = await Note.findAll({
    include: [
      {
        model: Evaluation,
        required: true,
        attributes:['id','coefficient','noteMaximale','moduleId']
      },
      {
        model: Eleve,
        required: true,
        attributes:['id','formationId']
      }
    ],
    where: notesParameters,
    attributes:['id','note','eleveId','evaluationId','statutId']
  })

  //Récupération des informations liées aux élèves concernés par la recherche du secrétaire
  result["eleves"] = await Eleve.findAll(
    {
      where: eleveParameters,
      order: [
        ['nom', 'ASC'],
        ['prenom', 'ASC'],
      ],
      attributes:['id','nom','prenom','numeroEtudiant','trombinoscope']
    }
  )
  //Récupération des informations liées aux modules concernés par la recherche du secrétaire
  result["modules"] = await ModuleCours.findAll(
    {
      order: [
        ['id', 'ASC'],
      ],
      include: [{
        model: Formation,
        through: FormationModule, // Utilisez le modèle Sequelize correspondant à la table intermédiaire Formation-Module
        attributes:['id','libelle']
      }],
      where: modulesParameters,
      attributes:['id','libelle','codeApogee']
    }
  )

  tmpLstMoyenneEleveParModule = {}

  //Traitement de toutes les notes récupérer pour en extraire les données à renvoyer
  listNotes.forEach(item => {
    const eleveId = item.Eleve.id;
    const moduleId = item.Evaluation.moduleId;
    const possedeNote = item.note != null
    const note = parseFloat(item.note);

    //Préparation des données pour calculer la moyenne de chaque étudiant dans chaque module
    if (possedeNote) {
      if (!tmpLstMoyenneEleveParModule[eleveId]) {
        tmpLstMoyenneEleveParModule[eleveId] = {}
      }
      if (!tmpLstMoyenneEleveParModule[eleveId][moduleId]){
        tmpLstMoyenneEleveParModule[eleveId][moduleId] = {note:0, coefficient:0}
      }
      tmpLstMoyenneEleveParModule[eleveId][moduleId].note += note * Number.parseFloat(item.Evaluation.coefficient) / item.Evaluation.noteMaximale * 20;
      tmpLstMoyenneEleveParModule[eleveId][moduleId].coefficient += Number.parseFloat(item.Evaluation.coefficient);
    }
  });

  for (const [eleveId, lstMoyenneModule] of Object.entries(tmpLstMoyenneEleveParModule)) {
    result[eleveId]={}
    for (const [moduleId, moyenne] of Object.entries(lstMoyenneModule)) {
      result[eleveId][moduleId] = (moyenne.note / moyenne.coefficient).toFixed(2)

    }
  }
  return result
}


router.post("/insertNotes", async (req, res) => {
  const eval = req.body.evalId
  const eleve = req.body.eleveId
  const note = req.body.note
  const statutId = req.body.statutId

  // Récupération de la note actuelle si elle existe
  const dbNote = await Note.findOne(
    {
      where: {
        evaluationId: eval,
        eleveId: eleve
      }
    }
  )

  //Si elle n'existe pas on la crée, sinon on la met à jour
  if (dbNote == null) {
    Note.create({ evaluationId: eval, eleveId: eleve, note: note, statutId: statutId })
  } else {
    await Note.update({ note: note, statutId: statutId }, {
      where: {
        id: dbNote.id,
      },
    });
  }

  res.json("Succès")
})

router.post("/deleteNote", async (req, res) => {
  const eval = req.body.evalId
  const eleve = req.body.eleveId

  const countDelete = await Note.destroy(
    {
      where: {
        evaluationId: eval,
        eleveId: eleve
      }
    }
  )
  res.json({ "hasBeenDeleted": countDelete > 0 })
})



module.exports = router