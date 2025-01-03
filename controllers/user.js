const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    //On commence par hasher le password reçu hash(password, salt)
    bcrypt.hash(req.body.password, 10) //Promise
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save() //We create a new user so we have to save it in DB
        .then(() => res.status(201).json({message : 'Utilisateur crée !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
}

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user){
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrect'});
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    res.status(401).json({message: 'Paire identifiant/mot de passe incorrect'});
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, //on inclut l'user ID dans le payload
                            'RANDOM_TOKEN_SECRET', //string secrète pour déchiffrer le jwt
                            { expiresIn: '24h' } //expiration date du token
                            )
                    })
                }
            })
            .catch(error => { res.status(500).json({error})})
        }
    })
    .catch(error => { res.status(500).json({error})})
}