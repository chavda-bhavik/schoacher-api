module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
    },
};
