module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
    },
    globalSetup: './src/util/test-util/globalSetup.ts',
};
