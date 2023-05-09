module.exports = {
    // env：指定代码运行的环境，这里设置了浏览器环境和 ES2020 环境。
    env: {
        browser: true,
        es2020: true,
    },
    // plugins：指定需要使用的插件，这里包括了 React、TypeScript、Lodash 和 jsx-control-statements 插件。
    plugins: ['react', '@typescript-eslint', 'lodash', 'jsx-control-statements'],
    // extends：继承的 ESLint 规则集，这里包括了 eslint: recommended、standard、
    // @umijs/fabric、plugin:react/recommended、plugin: jsx - control - statements / recommended 等规则集
    extends: [
        'eslint:recommended',
        'standard',
        require.resolve('@umijs/fabric/dist/eslint'),
        'plugin:react/recommended',
        'plugin:jsx-control-statements/recommended',
    ],
    // globals 属性用于设置全局变量的使用情况，将值设置为 false 表示该变量不应被重新分配。
    globals: {
        TARGET: false,
        types: false,
    },
    // parser 属性用于指定解析器，这里设置为 @typescript-eslint / parser，
    // 意味着这份代码是使用 TypeScript 编写的，需要使用相应的解析器进行语法解析和检查。
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true, // 表示开启支持 JSX 语法。
        },
        ecmaVersion: 11, // 表示支持 ECMAScript 的哪个版本。
        sourceType: 'module', // 表示代码是 ECMAScript 模块。
    },
    rules: {
        indent: ['error', 2, { SwitchCase: 1 }],
        semi: ['off'],
        quotes: ['off'],
        'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
        'prefer-const': ['off'],
        'prefer-destructuring': ['off'],
        'no-param-reassign': ['off'],
        '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none' }],
        'no-plusplus': ['off'],
        'no-lonely-if': ['off'],
        'no-else-return': ['off'],
        'react/self-closing-comp': ['error', { component: true, html: false }],
        'react/prop-types': ['off'],
        //lodash
        'lodash/import-scope': ['error', 'method'],
    },
};
