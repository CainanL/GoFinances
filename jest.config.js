//arquivo que uso para remover o jest de dentro do package.json e evitar futuros incomodos
//rodo os testes com yarn test
module.exports = {
    preset: "jest-expo",
    testPathIgnorePatterns: [//define quais pastas não sejam testadas
        '/node_modules',//ex => não quero que teste tudo o que está dentro de node_modules
        '/android',
        '/ios'
    ],
    setupFilesAfterEnv: [
        "@testing-library/jest-native/extend-expect"
    ]
}