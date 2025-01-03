const multer = require("multer");

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

//constante de configuration à donner à multer
const storage = multer.diskStorage({
    //choix de destination, ici dossier images
    destination: (req, file, callback) => {
        //on renvoit toujours un callback, premier arg null pour indiquer aucune erreur
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        //on remplace les espaces par des _
        const name = file.originalname.split(" ").join("_");
        //nous n'avons pas aux extensions mais seulement aux MIME types
        const extension = MIME_TYPES[file.mimetype];
        //construction de notre fichier image
        //on utilise Date.now() pour l'unicité absolue
        callback(null, name + Date.now() + "." + extension);
    },
});

//export de la configuration, indiquation que nous gérons uniquement les téléchargements d'images
module.exports = multer({ storage: storage }).single("image");
