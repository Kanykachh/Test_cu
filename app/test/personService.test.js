import { fetchUsers, createUser } from '../src/domain/services/personService';
import axios from 'axios';

jest.mock('axios');

describe('personService', () => {

    describe('fetchUsers', () => {
        it('should return a list of users on success', async () => {
            const mockData = [
                { name: 'John Doe', email: 'john@example.com', address: { city: 'Paris', zipcode: '75001' } }
            ];
            axios.get.mockResolvedValue({ data: mockData });

            const users = await fetchUsers();
            expect(users).toHaveLength(1);
            expect(users[0]).toMatchObject({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                city: 'Paris',
                zip: '75001'
            });
        });

        it('should handle empty name or single word name', async () => {
            const mockData = [
                { name: '', email: 'empty@example.com', address: {} },
                { name: 'Alice', email: 'alice@example.com', address: { city: 'Lyon', zipcode: '69000' } }
            ];
            axios.get.mockResolvedValue({ data: mockData });

            const users = await fetchUsers();

            expect(users[0].firstName).toBe('');
            expect(users[0].lastName).toBe('');
            expect(users[1].firstName).toBe('Alice');
            expect(users[1].lastName).toBe('');
        });

        it('should throw SERVER_ERROR on network failure', async () => {
            axios.get.mockRejectedValue(new Error('Network Error'));
            await expect(fetchUsers()).rejects.toThrow('SERVER_ERROR');
        });

        it('should throw SERVER_ERROR if server returns 500', async () => {
            axios.get.mockRejectedValue({ response: { status: 500 } });
            await expect(fetchUsers()).rejects.toThrow('SERVER_ERROR');
        });
    });

    describe('createUser', () => {
        const person = { email: 'new@example.com', firstName: 'Alice', lastName: 'Smith' };

        it('should create a new user successfully', async () => {
            axios.post.mockResolvedValue({ data: person });

            const result = await createUser(person, []);
            expect(result).toEqual(person);
        });

        it('should create a new user when existingEmails not provided', async () => {
            const person = { email: 'bob@example.com', firstName: 'Bob', lastName: 'Builder' };
            axios.post.mockResolvedValue({ data: person });

            const result = await createUser(person);
            expect(result).toEqual(person);
        });

        it('should throw EMAIL_ALREADY_EXISTS if email exists locally', async () => {
            const existingEmails = ['new@example.com'];
            await expect(createUser(person, existingEmails)).rejects.toThrow('EMAIL_ALREADY_EXISTS');
        });

        it('should throw SERVER_ERROR on network failure', async () => {
            axios.post.mockRejectedValue(new Error('Network Error'));
            await expect(createUser(person, [])).rejects.toThrow('SERVER_ERROR');
        });

        it('should throw SERVER_ERROR if server returns 500', async () => {
            axios.post.mockRejectedValue({ response: { status: 500 } });
            await expect(createUser(person, [])).rejects.toThrow('SERVER_ERROR');
        });

        it('should throw SERVER_ERROR if server returns 400 (simulate backend email validation)', async () => {
            axios.post.mockRejectedValue({ response: { status: 400, data: { message: 'EMAIL_ALREADY_EXISTS' } } });
            await expect(createUser(person, [])).rejects.toThrow('EMAIL_ALREADY_EXISTS');
        });
    });

});

