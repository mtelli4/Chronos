// const express = require('express');
// const router = express.Router();


// router.post("/", async (req, res) => {
//     const identifiants =  req.body; // obtient le corps de la requête (format json)
//     // faire requête SQL
//     console.log(identifiants);
    
//     console.log(`Nombre de lignes mises à jour : ${rowCount}`);
//     console.log('Utilisateurs mis à jour :', updatedUsers);
    
//     if (rowCount > 0) {
//         // La mise à jour a réussi
//         console.log('Utilisateur mis à jour avec succès');
//         res.send("1"); // pour renvoyer un simple chiffre ou string
//     } else {
//         // Aucune ligne mise à jour (aucun utilisateur trouvé avec cet identifiant)
//         console.log("L'utilisateur avec cet identifiant n'a pas été trouvé");
//         res.send("0"); // pour renvoyer un simple chiffre ou string
//     }
// })
// module.exports = router