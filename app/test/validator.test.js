import {validateEmail, validateName, validateAge, validatePerson, validateZipCode, validateCity} from "../src/domain/validator.js";

describe("validatePerson Unit Test Suites", () => {
    it("should throw INVALID_PERSON if param is missing or invalid", () => {
        expect(() => validatePerson()).toThrow("MISSING_PARAM: person");
        expect(() => validatePerson(null)).toThrow("MISSING_PARAM: person");
        expect(() => validatePerson("not an object")).toThrow("MISSING_PARAM: person");
    });

    it("should throw MISSING_PARAM for missing fields", () => {
        expect(() => validatePerson({})).toThrow("MISSING_PARAM: birthDate");
        expect(() => validatePerson({ birthDate: new Date() })).toThrow("MISSING_PARAM: zip");
        expect(() => validatePerson({ birthDate: new Date(), zip: "03100" })).toThrow("MISSING_PARAM: city");
        expect(() => validatePerson({ birthDate: new Date(), zip: "03100", city: "Montluçon", })).toThrow("MISSING_PARAM: firstName");
        expect(() => validatePerson({ birthDate: new Date(), zip: "03100", city: "Montluçon", firstName: "Théo" })).toThrow("MISSING_PARAM: lastName");
        expect(() => validatePerson({ birthDate: new Date(), zip: "03100", city: "Montluçon", firstName: "Théo", lastName: "Lafond" })).toThrow("MISSING_PARAM: email");
    });

    it("should throw PARAM_TYPE_ERROR for wrong field types", () => {
        const base = { birthDate: new Date(), zip: "03100", city: "Montluçon", firstName: "Théo", lastName: "Lafond", email: "test@mail.com" };
        expect(() => validatePerson({ ...base, birthDate: "2000-01-01" })).toThrow("PARAM_TYPE_ERROR: birthDate must be a Date");
        expect(() => validatePerson({ ...base, zip: 123 })).toThrow("PARAM_TYPE_ERROR: zip must be a string");
        expect(() => validatePerson({ ...base, city: 123 })).toThrow("PARAM_TYPE_ERROR: city must be a string");
        expect(() => validatePerson({ ...base, firstName: 123 })).toThrow("PARAM_TYPE_ERROR: firstName must be a string");
        expect(() => validatePerson({ ...base, lastName: 123 })).toThrow("PARAM_TYPE_ERROR: lastName must be a string");
        expect(() => validatePerson({ ...base, email: 123 })).toThrow("PARAM_TYPE_ERROR: email must be a string");
    });

    it("should validate a correct person object", () => {
        const person = {
            birthDate: new Date("09/02/2001"),
            zip: "03100",
            city: "Montluçon",
            firstName: "Théo",
            lastName: "Lafond",
            email: "theo@mail.com"
        };

        expect(validatePerson(person)).toBe(true);
    });
});

describe("validateAge Unit Test Suites", () => {
    it("should throw UNDERAGE if age < 18", () => {
        const child = new Date(new Date().getFullYear() - 10, 0, 1);
        expect(() => validateAge(child)).toThrow("UNDERAGE");
    });

    it("should throw INVALID_DATE if birthDate is invalid", () => {
        expect(() => validateAge(null)).toThrow("INVALID_DATE");
        expect(() => validateAge("abc")).toThrow("INVALID_DATE");
        expect(() => validateAge(new Date("invalid date"))).toThrow("INVALID_DATE");
    });

    it("should throw FUTURE_DATE if birthDate is in the future", () => {
        const future = new Date(new Date().getFullYear() + 5, 0, 1);
        expect(() => validateAge(future)).toThrow("FUTURE_DATE");
    });

    it("should throw BIRTHDATE_TOO_OLD if birthDate is before 1900", () => {
        const ancient = new Date(1800, 0, 1);
        expect(() => validateAge(ancient)).toThrow("BIRTHDATE_TOO_OLD");
    });

    it("should accept adult", () => {
        const adult = new Date(new Date().getFullYear() - 20, 0, 1);
        expect(validateAge(adult)).toBe(true);
    });
});

describe("validateZipCode Unit Test Suites", () => {
    it("should throw INVALID_ZIP for invalid codes", () => {
        ["1234", "ABCDE", null, "123456", ].forEach(zip => {
            expect(() => validateZipCode(zip)).toThrow("INVALID_ZIP");
        });
    });

    it("should accept a valid code", () => {
        expect(validateZipCode("03100")).toBe(true);
    });
});

describe("validateCity Unit Test Suites", () => {
    it("should throw INVALID_CITY for numbers, symbols, types", () => {
        ["Paris123", "Lyon@", "", null, 123].forEach(city => {
            expect(() => validateCity(city)).toThrow("INVALID_CITY");
        });
    });

    it("should throw XSS_DETECTED for script injections", () => {
        expect(() => validateCity("<script>")).toThrow("XSS_DETECTED");
    });

    it("should accept valid city names", () => {
        ["Paris", "Le Mans", "Saint-Étienne"].forEach(city => {
            expect(validateCity(city)).toBe(true);
        });
    });
});

describe("validateName Unit Test Suites", () => {
    it("should throw INVALID_FIRST_NAME or INVALID_LAST_NAME for bad characters", () => {
        expect(() => validateName("Théo3", "firstName")).toThrow("INVALID_FIRST_NAME");
        expect(() => validateName("Dur@nd", "lastName")).toThrow("INVALID_LAST_NAME");
    });

    it("should throw INVALID_IDENTITY for bad type", () => {
        expect(() => validateName(123, "firstName")).toThrow("INVALID_FIRST_NAME");
        expect(() => validateName(123, "lastName")).toThrow("INVALID_LAST_NAME");
    });

    it("should throw XSS_DETECTED for script injections", () => {
        expect(() => validateName("<script>", "firstName")).toThrow("XSS_DETECTED");
    });

    it("should accept valid names", () => {
        expect(validateName("Jean-Luc", "firstName")).toBe(true);
        expect(validateName("Élodie", "lastName")).toBe(true);
        expect(validateName("Maël", "firstName")).toBe(true);
    });
});

describe("validateEmail Unit Test Suites", () => {
    it("should throw INVALID_EMAIL for invalid emails", () => {
        ["test@", "@mail.com", "test@mail", null, ].forEach(email => {
            expect(() => validateEmail(email)).toThrow("INVALID_EMAIL");
        });
    });

    it("should accept valid emails", () => {
        expect(validateEmail("test@mail.com")).toBe(true);
    });
});