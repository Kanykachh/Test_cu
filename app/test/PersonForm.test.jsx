import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PersonForm from '../src/components/PersonForm';

beforeEach(() => {
    localStorage.clear();
});

describe("PersonForm field validation", () => {
    test("firstName shows error for invalid input", () => {
        render(<PersonForm />);
        const firstNameInput = screen.getByRole('textbox', { name:/firstName/i});
        fireEvent.change(firstNameInput, { target: { value: '123' } });
        fireEvent.blur(firstNameInput);
        expect(screen.getByText(/prénom/i)).toBeInTheDocument();
    });

    test("lastName shows error for invalid input", () => {
        render(<PersonForm />);
        const lastNameInput = screen.getByRole('textbox', { name:/lastName/i});
        fireEvent.change(lastNameInput, { target: { value: '!' } });
        fireEvent.blur(lastNameInput);
        expect(screen.getByText(/nom/i)).toBeInTheDocument();
    });

    test("zip shows error for invalid zip", () => {
        render(<PersonForm />);
        const zipInput = screen.getByRole('textbox', { name:/zip/i});
        fireEvent.change(zipInput, { target: { value: 'invalid-zip' } });
        fireEvent.blur(zipInput);
        expect(screen.getByText(/code postal/i)).toBeInTheDocument();
    });

    test("email shows error for invalid email", () => {
        render(<PersonForm />);
        const emailInput = screen.getByRole('textbox', { name:/email/i});
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.blur(emailInput);
        expect(screen.getByText(/email/i)).toBeInTheDocument();
    });

    test("birthDate shows FUTURE_DATE error", () => {
        render(<PersonForm />);
        const birthDateInput = screen.getByTestId('birthDate');
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 5);
        fireEvent.change(birthDateInput, { target: { value: futureDate.toISOString().split('T')[0] } });
        fireEvent.blur(birthDateInput);
        expect(screen.getByText(/futur/i)).toBeInTheDocument();
    });

    test("birthDate shows UNDERAGE error", () => {
        render(<PersonForm />);
        const birthDateInput = screen.getByTestId('birthDate');
        const underageDate = new Date();
        underageDate.setFullYear(underageDate.getFullYear() - 10);
        fireEvent.change(birthDateInput, { target: { value: underageDate.toISOString().split('T')[0] } });
        fireEvent.blur(birthDateInput);
        expect(screen.getByText(/18 ans/i)).toBeInTheDocument();
    });

    test("city shows XSS error", () => {
        render(<PersonForm />);
        const cityInput = screen.getByRole('textbox', { name:/city/i});
        fireEvent.change(cityInput, { target: { value: "<script>" } });
        fireEvent.blur(cityInput);
        expect(screen.getByText(/interdits/i)).toBeInTheDocument();
    });

});

describe('PersonForm Integration Tests', () => {
    test('chaotic user flow: invalid inputs, corrections, resubmissions', async () => {
        const user = userEvent.setup();
        const { mockAddPerson } = renderPersonForm();

        const firstName = screen.getByRole('textbox', {name: /firstname/i});
        const lastName = screen.getByRole('textbox', {name: /lastname/i});
        const email = screen.getByRole('textbox', {name: /email/i});
        const zip = screen.getByRole('textbox', {name: /zip/i});
        const city = screen.getByRole('textbox', {name: /city/i});
        const birthDate = screen.getByTestId('birthDate');
        const submitBtn = screen.getByRole('button', {name: /soumettre/i});

        // Step 1: Completely invalid entries
        await user.type(firstName, '123');
        await user.tab();

        await user.type(lastName, '!');
        await user.tab();

        await user.type(email, 'not-an-email');
        await user.tab();

        await user.type(zip, 'abc');
        await user.tab();

        await user.type(city, '123Paris');
        await user.tab();

        await user.type(birthDate, '2050-01-01');
        await user.tab();

        // The form should not be submitted
        expect(submitBtn).toBeDisabled();

        // Step 2: partial corrections (still imperfect)
        await user.clear(firstName);
        await user.type(firstName, 'Théo');

        await user.clear(email);
        await user.type(email, 'Theo@');

        await user.clear(city);
        await user.type(city, '<script>');

        expect(submitBtn).toBeDisabled();

        // Step 3: Final correction
        await user.clear(lastName);
        await user.type(lastName, 'Lafond');

        await user.clear(email);
        await user.type(email, 'theo@example.com');

        await user.clear(zip);
        await user.type(zip, '03100');

        await user.clear(city);
        await user.type(city, 'Montluçon');

        await user.clear(birthDate);
        await user.type(birthDate, '2001-02-09');

        // Everything is valid
        expect(submitBtn).not.toBeDisabled();

        // Step 4: Submission
        await user.click(submitBtn);

        await waitFor(() => {
            const toast = document.querySelector('.Toastify__toast');
            expect(toast).toBeInTheDocument();
            expect(toast).toHaveTextContent(/enregistré avec succès/i);

            const savedPersons = JSON.parse(localStorage.getItem('persons'));
            expect(savedPersons).toBeTruthy();
            expect(savedPersons.length).toBeGreaterThan(0);

            const saved = savedPersons[savedPersons.length - 1];
            expect(saved.firstName).toBe('Théo');
            expect(saved.lastName).toBe('Lafond');
            expect(saved.email).toBe('theo@example.com');
            expect(saved.zip).toBe('03100');
            expect(saved.city).toBe('Montluçon');
            expect(saved.birthDate.startsWith('2001-02-09')).toBe(true);
        });
    });
});

describe('PersonForm localStorage pre-existing users', () => {
    test('adds new user to existing users in localStorage', async () => {
        localStorage.setItem('persons', JSON.stringify([
            { firstName: 'Alice', lastName: 'Dupont', email: 'alice@example.com', birthDate: '1990-01-01', zip: '75000', city: 'Paris' }
        ]));

        const user = userEvent.setup();
        const { mockAddPerson } = renderPersonForm();

        await user.type(screen.getByRole('textbox', { name: /firstName/i }), 'Théo');
        await user.type(screen.getByRole('textbox', { name: /lastName/i }), 'Lafond');
        await user.type(screen.getByRole('textbox', { name: /email/i }), 'theo@example.com');
        await user.type(screen.getByRole('textbox', { name: /zip/i }), '03100');
        await user.type(screen.getByRole('textbox', { name: /city/i }), 'Montluçon');
        await user.type(screen.getByTestId('birthDate'), '2001-02-09');

        const submitBtn = screen.getByRole('button', { name: /soumettre/i });
        expect(submitBtn).not.toBeDisabled();
        await user.click(submitBtn);

        await waitFor(() => {
            const savedPersons = JSON.parse(localStorage.getItem('persons'));
            expect(savedPersons).toHaveLength(2);
            expect(savedPersons[0].firstName).toBe('Alice');
            expect(savedPersons[1].firstName).toBe('Théo');
        });
    });
});

const renderPersonForm = () => {
    const mockAddPerson = jest.fn((person) => {
        const stored = JSON.parse(localStorage.getItem('persons') || '[]');
        localStorage.setItem('persons', JSON.stringify([...stored, person]));
    });
    render(<PersonForm addPerson={mockAddPerson} />);
    return { mockAddPerson };
};


