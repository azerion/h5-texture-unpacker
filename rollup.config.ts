import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser'
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';


const pkg = require('./package.json');

const libraryName = 'h5-texture-unpacker';

const isWatching = process.argv.findIndex((element) => element === '-w') !== -1;

let basePlugins = [];
if (isWatching) {
    basePlugins = [
        serve({
            contentBase: ['./', './example'],
            port: 8080
        })
    ];
}
export default {
    input: `src/${libraryName}.ts`,
    output: [
        {file: pkg.main, format: 'es', sourcemap: false}
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
        include: 'src/**',
    },
    plugins: basePlugins.concat([
        preserveShebangs(),
        // Compile TypeScript files
        typescript({useTsconfigDeclarationDir: false, objectHashIgnoreUnknownHack: true}),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve(),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),
        terser({
            include: [/^.+\.min\.js$/],
        })
    ])
};
