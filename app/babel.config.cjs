module.exports = {
    presets: [
        ['@babel/preset-react', { runtime: 'automatic' }], // <- important
        '@babel/preset-env',
    ],
};