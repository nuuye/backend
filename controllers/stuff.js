const Thing = require("../models/thing");
const fs = require("fs");

exports.createThing = (req, res, next) => {
    //besoin de parse car le front envoie sous forme form-data (string) et non JSON
    const thingObject = JSON.parse(req.body.thing);
    //on supprime tous les IDs car on utilise ceux de JWT, ne jamais faire confiance au front/client
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });

    thing
        .save()
        .then(() => {
            res.status(201).json({ message: "Objet enregistré !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.modifyThing = (req, res, next) => {
    //on doit gérer les deux cas : si la requête contient une image ou non
    const thingObject = req.file
        ? {
              ...JSON.parse(req.body.thing), //si image alors on parse car string
              imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
        : { ...req.body }; //sinon on récupère simplement le body

    delete thingObject._userId; //supression de l'userId du client
    Thing.findOne({ _id: req.params.id }) // on vérifie si l'objet est présent en BDD
        .then((thing) => {
            //si oui on vérifie qu'il appartient bien à l'utilisateur qui tente de le modifier
            if (thing.userId != req.auth.userId) {
                //compare UserId de BDD à userId du token jwt
                res.status(401).json({ message: "Not authorized" });
            } else {
                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet modifié!" }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => res.status(200).json(thing))
        .catch((error) => res.status(404).json({ error }));
};


exports.deleteThing = (req, res, next) => {
    //on recherche le thing correspondant en BDD
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            //on s'assure que l'utilisateur qui le supprime et celui qui l'a crée
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = thing.imageUrl.split("/images/")[1];
                //on supprime l'image de notre dossier images
                fs.unlink(`images/${filename}`, () => {
                    //on supprime le thing de notre BDD
                    Thing.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: "Objet supprimé !" });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.getAllThing = (req, res, next) => {
    Thing.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => res.status(400).json({ error }));
};
