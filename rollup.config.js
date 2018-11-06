import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json';

const NODE_ENV = process.env.NODE_ENV || 'development',
    dev = NODE_ENV === 'development',
    outputFile = dev ? './lib/dev.js' : './lib/prod.js',
    peerDependencies = Object.keys(packageJson.peerDependencies).join('|');

const config = {
    input: './src/index.js',
    output: {
        file: outputFile,
        format: 'cjs',
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        resolve(),
        commonjs({
            include: [
                'node_modules/**'
            ],
            exclude: [
                'node_modules/process-es6/**'
            ],
            namedExports: {
                'node_modules/react/index.js': ['Component'],
            }
        }),
    ],
    external: id => new RegExp(`^(?:${peerDependencies})`).test(id)
};

if (!dev) {
    config.plugins.push(terser());
}

export default config;