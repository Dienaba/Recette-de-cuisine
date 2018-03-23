var express = require('express');
var router = express.Router();
var validator = require('validator');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

router.get('/create', function(req, res, next) {
  res.render('user/create', {title: 'Créer un nouvel utilisateur', errors:[]});
});

router.post('/', async function(req, res, next) {
  var userInfo = req.body;
  var errors = [];

  if (userInfo.prenom.length > 25 || userInfo.prenom.length == 2){
    errors.push('Prénom entre 2 et 25 caractères')
  }
  if (userInfo.nom.length > 25 || userInfo.nom.length == 2){
    errors.push('Nom entre 2 et 25 caractères')
  }
  if (!validator.isEmail(userInfo.mail)){
    errors.push('Email invalide')
  }
  if (userInfo.mdp != userInfo.cmdp) {
    errors.push('Les deux mots de passe sont différents')
  }

  if (errors.length > 0){
    res.render('user/create', {title:'Errors', errors:errors})
  } else {
    var encryptedPassword = await bcrypt.hash(userInfo.mdp, 10);

    var usersSchema = new mongoose.Schema({
      nom: String,
      prenom: String,
      utilisateur: String,
      mdp: String,
      mail: {type:String, unique:true}
    });
    var userModel = mongoose.model('User', usersSchema);
    var user = new userModel({
      nom: userInfo.nom,
      prenom: userInfo.prenom,
      utilisateur: userInfo.utilisateur,
      mdp: encryptedPassword,
      mail: userInfo.mail,
    });
    try {
      await user.save();
      res.send('ok')
    } catch(err) {
      next(err)
    }
  }
});

module.exports = router;
