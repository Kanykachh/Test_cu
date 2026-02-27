module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|scss|svg|png|jpg|jpeg|gif)$': '<rootDir>/test/__mocks__/fileMock.js',
    },
};