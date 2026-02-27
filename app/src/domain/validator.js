import {calculateAge} from "./module.js";

/**
 * Validates all parameters for a person
 * @param {Object} person - { birthDate, zip, identity, email }
 * @param {Date} person.birthDate - Date of birth
 * @param {string} person.zip - French zip code (5 digits)
 * @param {string} person.city - City name (letters, accents, espace, hyphens)
 * @param {string} person.firstName - First name (letters, accents, hyphens)
 * @param {string} person.lastName - Last name (letters, accents, hyphens)
 * @param {string} person.email - Email address
 * @returns {true} if everything is valid
 * @throws {Error} MISSING_PARAM, PARAM_TYPE_ERROR, UNDERAGE, INVALID_ZIP, INVALID_CITY, INVALID_FIRST_NAME, INVALID_LAST_NAME, XSS_DETECTED, INVALID_EMAIL
 */
export function validatePerson(person) {
    if (!person || typeof person !== "object") {
        throw new Error("MISSING_PARAM: person");
    }

    if (!person.birthDate) throw new Error("MISSING_PARAM: birthDate");
    if (!person.zip) throw new Error("MISSING_PARAM: zip");
    if (!person.city) throw new Error("MISSING_PARAM: city");
    if (!person.firstName) throw new Error("MISSING_PARAM: firstName");
    if (!person.lastName) throw new Error("MISSING_PARAM: lastName");
    if (!person.email) throw new Error("MISSING_PARAM: email");

    if (!(person.birthDate instanceof Date)) throw new TypeError("PARAM_TYPE_ERROR: birthDate must be a Date");
    if (typeof person.zip !== "string") throw new TypeError("PARAM_TYPE_ERROR: zip must be a string");
    if (typeof person.city !== "string") throw new TypeError("PARAM_TYPE_ERROR: city must be a string");
    if (typeof person.firstName !== "string") throw new TypeError("PARAM_TYPE_ERROR: firstName must be a string");
    if (typeof person.lastName !== "string") throw new TypeError("PARAM_TYPE_ERROR: lastName must be a string");
    if (typeof person.email !== "string") throw new TypeError("PARAM_TYPE_ERROR: email must be a string");

    validateAge(person.birthDate);
    validateZipCode(person.zip);
    validateCity(person.city)
    validateName(person.firstName);
    validateName(person.lastName);
    validateEmail(person.email);

    return true;
}

/**
 * Validates a person's age based on birth date.
 * Rejects if under 18 years old, in the future, or too far in the past.
 *
 * @param {Date} birthDate - Date of birth
 * @returns {boolean} Returns true if age is 18 or older
 *
 * @throws {TypeError} INVALID_DATE - If birthDate is not a valid Date object or cannot be parsed
 * @throws {Error} FUTURE_DATE - If birthDate is in the future
 * @throws {Error} BIRTHDATE_TOO_OLD - If birthDate is before 1900
 * @throws {Error} UNDERAGE - If age < 18
 */
export function validateAge(birthDate) {
    if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
        throw new TypeError("INVALID_DATE");
    }

    const now = new Date();
    if (birthDate > now) throw new Error("FUTURE_DATE");

    const year = birthDate.getFullYear();
    if (year < 1900) throw new Error("BIRTHDATE_TOO_OLD")

    const age = calculateAge({birth: birthDate});
    if (age < 18) throw new Error("UNDERAGE");

    return true;
}

/**
 * Validates a zip code.
 * Must be exactly 5 digits.
 * @param {string} zip - Zip code
 * @returns {boolean} Returns true if zip is valid
 * @throws {Error} Throws "INVALID_ZIP" if zip is invalid
 */
export function validateZipCode(zip) {
    if (typeof zip !== "string" || !/^\d{5}$/.test(zip)) {
        throw new Error("INVALID_ZIP");
    }
    return true;
}

/**
 * Validate a city name.
 * Only letters, accents, spaces and hyphens are allowed.
 * Rejects simple XSS patterns.
 * @param {string} city - The city name to validate
 * @returns {boolean} true if valid
 * @throws {Error} INVALID_CITY if format is incorrect
 * @throws {Error} XSS_DETECTED if a basic XSS pattern is detected
 */
export function validateCity(city) {
    if (typeof city !== "string") throw new Error("INVALID_CITY");
    if (/<[^>]*>/.test(city)) throw new Error("XSS_DETECTED");
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/.test(city)) {
        throw new Error("INVALID_CITY");
    }
    return true;
}


/**
 * Validate a name (first or last) and return specific error messages
 * @param {string} name - The name to validate
 * @param {string} type - "firstName" or "lastName" for custom error messages
 * @returns {boolean} true if valid
 * @throws {Error} with message INVALID_FIRST_NAME or INVALID_LAST_NAME, XSS_DETECTED
 */
export function validateName(name, type = "firstName") {
    if (typeof name !== "string") throw new Error(type === "firstName" ? "INVALID_FIRST_NAME" : "INVALID_LAST_NAME");
    if (/<[^>]*>/.test(name)) throw new Error("XSS_DETECTED");
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/.test(name)) {
        throw new Error(type === "firstName" ? "INVALID_FIRST_NAME" : "INVALID_LAST_NAME");
    }
    return true;
}

/**
 * Validates an email address.
 * Must be in standard email format.
 * @param {string} email - Email to validate
 * @returns {boolean} Returns true if email is valid
 * @throws {Error} Throws "INVALID_EMAIL" if email format is incorrect
 */
export function validateEmail(email) {
    if (typeof email !== "string") {
        throw new Error("INVALID_EMAIL");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email.trim())) {
        throw new Error("INVALID_EMAIL");
    }
    return true;
}
