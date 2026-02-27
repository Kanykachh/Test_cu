import {calculateAge} from "../src/domain/module.js"

let people20years;
beforeEach(() => {
    // Dynamically sets birth date to 20 years ago from today, ensuring the test remains correct next year and beyond
    let date = new Date();
    people20years = {
        birth: new Date(date.setFullYear(date.getFullYear() - 20))
    };
})

/**
 * @function calculateAge
 */
describe('calculateAge Unit Test Suites', () => {
    it('should return a correct age', () => {
        expect(calculateAge(people20years)).toEqual(20)
    })

    it('should throw a "missing param p" error', () => {
        expect(() => calculateAge()).toThrow("missing param p")
        expect(() => calculateAge(null)).toThrow("missing param p");
    })

    it('should throw "param p must be an object" if a non-object is passed', () => {
        expect(() => calculateAge("not an object")).toThrow("param p must be an object");
        expect(() => calculateAge(1)).toThrow("param p must be an object");
    });

    it('should throw "missing birth field in param p" if birth is missing', () => {
        const loise = {
            name: String("loise")
        };
        expect(() => calculateAge(loise)).toThrow("missing birth field in param p");
    });

    it('should throw "birth must be a Date object" if birth is not a Date', () => {
        expect(() => calculateAge({ birth: "2001-09-02" })).toThrow("birth must be a Date object");
        expect(() => calculateAge({ birth: 1 })).toThrow("birth must be a Date object");
    });

    it('should throw "invalid birth date" if birth is an invalid date', () => {
        expect(() => calculateAge({ birth: new Date("invalid date") })).toThrow("invalid birth date");
    });

})