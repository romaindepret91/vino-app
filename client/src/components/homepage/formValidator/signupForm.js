export function getInputError(name, value) {
    let errorMsg = null;
    let regex;
    switch (name) {
        case "prenom":
        case "nom":
            regex = new RegExp(
                /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/
            );
            if (!regex.test(value.trim()))
                errorMsg =
                    "Doit comporter entre 2 et 30 caractères alphabétiques";
            break;
        case "nom_utilisateur":
            regex = new RegExp(
                /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
            );
            if (!regex.test(value.trim()))
                errorMsg =
                    "Doit comporter entre 5 et 30 caractères alphanumériques";
            break;
        case "courriel":
            regex = new RegExp(
                /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
            );
            if (!regex.test(value.trim()))
                errorMsg = "Format d'adresse courriel invalide";
            break;
        case "motDePasse":
        case "motDePasse_confirme":
            regex = new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
            );
            if (!regex.test(value.trim()))
                errorMsg =
                    "Doit comporter au moins 8 caractères alphanumériques: au moins 1 lettre majuscule, 1 lettre minuscule et 1 chiffre";
    }
    return errorMsg;
}
