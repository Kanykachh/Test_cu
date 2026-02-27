/**
 * Calculate a person's age in years
 *
 * @param {object} p An object representing a person, implementing a birth Date parameter.
 * @returns {number} The age in years of p.
 */
export function calculateAge(p){
    if(!p){
        throw new Error("missing param p")
    }

    if (typeof p !== "object") {
        throw new TypeError("param p must be an object");
    }

    if (!("birth" in p)) {
        throw new Error("missing birth field in param p");
    }

    if (!(p.birth instanceof Date)) {
        throw new TypeError("birth must be a Date object");
    }

    if (Number.isNaN(p.birth.getTime())) {
        throw new TypeError("invalid birth date");
    }

    let dateDiff = new Date(Date.now() - p.birth.getTime());
    let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
    return age;
}