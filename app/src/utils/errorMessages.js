/**
 * Object containing all error messages used in the form
 * @constant {Object.<string, string>}
 * @property {string} INVALID_FIRST_NAME - "Le prénom n'est pas valide"
 * @property {string} INVALID_LAST_NAME - "Le nom n'est pas valide"
 * @property {string} INVALID_EMAIL - "L'email n'est pas valide"
 * @property {string} EMAIL_ALREADY_EXISTS - "Cet email est déjà utilisé"
 * @property {string} INVALID_ZIP - "Le code postal doit contenir 5 chiffres"
 * @property {string} INVALID_CITY - "Le nom de la ville n'est pas valide"
 * @property {string} UNDERAGE - "Vous devez avoir au moins 18 ans"
 * @property {string} FUTURE_DATE - "La date de naissance ne peut pas être dans le futur"
 * @property {string} INVALID_DATE - "La date de naissance est invalide",
 * @property {string} BIRTHDATE_TOO_OLD - "La date de naissance est trop ancienne",
 * @property {string} XSS_DETECTED - "Caractères interdits détectés"
 * @property {string} SERVER_ERROR - "Serveur indisponible, réessayez plus tard"
 */
export const errorMessages = {
    INVALID_FIRST_NAME: "Le prénom n'est pas valide",
    INVALID_LAST_NAME: "Le nom n'est pas valide",
    INVALID_EMAIL: "L'email n'est pas valide",
    EMAIL_ALREADY_EXISTS: "Cet email est déjà utilisé",
    INVALID_ZIP: "Le code postal doit contenir 5 chiffres",
    INVALID_CITY: "Le nom de la ville n'est pas valide",
    UNDERAGE: "Vous devez avoir au moins 18 ans",
    FUTURE_DATE: "La date de naissance ne peut pas être dans le futur",
    INVALID_DATE: "La date de naissance est invalide",
    BIRTHDATE_TOO_OLD: "La date de naissance est trop ancienne",
    XSS_DETECTED: "Caractères interdits détectés",
    SERVER_ERROR: "Serveur indisponible, réessayez plus tard"
};

/**
 * Retrieves the error message corresponding to a given key
 * @param {string} key - The error key (e.g., "INVALID_EMAIL", "UNDERAGE")
 * @returns {string} The corresponding error message, or "Unknown error" if the key does not exist
 */
export function getErrorMessage(key) {
    return errorMessages[key] || "Erreur inconnue";
}