# ThreeJs Boilerplate + TS 

Just convenient environment to run some experiments with the ThreeJS and do not lose it in space and time.

Minimalistic Webpack + TS + SCSS Scaffolding. With preconfigured TypeScript (TS), Sass (SCSS).

## Content
1. `src/00.firsttry` just try the ThreeJS
2. `src/01.cube` draw the cube - "3D Hello World" (second after the triangle ;))
3. `src/02.udemy.threejs` some practice while taking udemy course
4. `src/03.geomapping` converting GeoJSON to 3js compatible geometry and drawing vector mapping data (borders, regions, labels and charts)
5. `src/04.examples` CSS2D Renderer and pixel/texel size calculation
6. `src/05.udemy.interactive-globe` Udemy. Interactive 3d globe with custom ThreeJS shaders. Solving course practical tasks.

## Earth Raster marble
- https://visibleearth.nasa.gov/collection/1484/blue-marble

## Setup
1. [Download ZIP and unpack](https://github.com/mykhailo-petrenko/webpack-boilerplate/archive/refs/heads/master.zip). Or clone and remove `.git` folder.
2. Rename project in `package.json`
3. `yarn install`
4. `yarn start`

## File sctucture
* `src` - Sources
  * `template.html` - entry html page.
  * `index.ts` - entry (main) typescript file.
  * `styles` - SCSS styles
* `config`
  * `.babelrc` - Babel config
  * `webpack.*.js` - webpack configuration
  * `path.js` - paths to src, public and build folders
* `public` - folder to keep static files. They will be copied to build directory while build.
* `typings` - folder to keep TypeScript types definition.
* `tsconfig.json` - TypeScript config
