import Bun from 'bun';

await Bun.build({
    entrypoints: ["assets/styles.css"],
    outdir: "assets",
    naming: "[name].min.[ext]",
    minify: true,
})

await Bun.build({
    entrypoints: ["index.ts"],
    outdir: "assets",
    naming: "[dir]/main.min.[ext]",
    minify: true,
});
