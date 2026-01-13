await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: 'src/build',
    target: 'bun',
    minify:  {
        whitespace: true,
        syntax: true,
    },
    compile: {
        target: "bun-darwin-arm64", //sempre compilar em binario porque é mais leve
        outfile: "server"
    }
})
export {

}