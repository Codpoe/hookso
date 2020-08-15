module.exports = api => {
  api.cache(false);

  return {
    presets: [
      ['@babel/preset-env', { modules: false }],
      '@babel/preset-typescript',
      '@babel/preset-react',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          useESModules: true,
          corejs: 3,
        },
      ],
      '@babel/plugin-proposal-class-properties',
    ],
  };
};
