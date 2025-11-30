module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'controllers/**/*.js',
        'routes/**/*.js',
        'utils/**/*.js',
        '!node_modules/**'
    ],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    testTimeout: 10000
};
