const jwt = require("jsonwebtoken");
const user = require("../models/user");

//middleware qui vérifiant la validité du token JWT
module.exports = (req, res, next) => {
    try {
        //Récupère le token, le client le renvoi comme suit : Bearer tokenString
        const token = req.headers.authorization.split(" ")[1];
        //Une fois le token récupéré on doit le décoder
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        //Création d'un objet auth sur req pour vérifier l'identité
        req.auth = {
            userId: userId, //chaque route possédera l'userId décodé du token
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
