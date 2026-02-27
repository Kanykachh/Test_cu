import { getErrorMessage } from '../src/utils/errorMessages';

describe('getErrorMessage', () => {
    test('returns message for known keys', () => {
        expect(getErrorMessage('INVALID_FIRST_NAME')).toBe('Le prénom n\'est pas valide');
        expect(getErrorMessage('UNDERAGE')).toBe('Vous devez avoir au moins 18 ans');
    });

    test('returns "Erreur inconnue" for unknown keys', () => {
        expect(getErrorMessage('UNKNOWN_KEY')).toBe('Erreur inconnue');
    });
});
