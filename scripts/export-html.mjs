import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

const project=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const transparentPixel='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';
const inlineScript=code=>code.replace(/<\/script/gi,'<\\/script').replace(/^\/\/# sourceMappingURL=.*$/gm,'');

// Use the same game and UI as the hosted edition; only the asset loader changes.
export async function createSingleFileHTML(){
 const read=name=>readFile(resolve(project,'dist',name),'utf8');
 const [template,leafletCSS,style,mobile,leafletJS,peerJS,geoText,licenses]=await Promise.all([
  'index.html','vendor/leaflet.css','style.css','mobile.css','vendor/leaflet.js','vendor/peerjs.min.js','kanto.geojson','licenses.txt'
 ].map(read));
 const geo=JSON.parse(geoText);
 const licenseData='data:text/plain;charset=utf-8,'+encodeURIComponent(licenses);
 const result=await build({
  entryPoints:[resolve(project,'dist/app.js')],bundle:true,write:false,format:'iife',platform:'browser',
  target:['safari15','chrome90'],minify:true,charset:'utf8',legalComments:'inline',
  plugins:[{name:'embedded-game-assets',setup(builder){builder.onLoad({filter:/[/\\]assets\.js$/},()=>({
   contents:`export async function loadKanto(){return ${JSON.stringify(geo)}}\nexport function licenseURL(){return ${JSON.stringify(licenseData)}}`,loader:'js'
  }))}}]
 });
 const css=[leafletCSS.replace(/url\(images\/[^)]+\)/g,`url(${transparentPixel})`),style,mobile].join('\n');
 let html=template.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g,'').replace(/<script\b[^>]*src="[^"]+"[^>]*><\/script>/g,'');
 html=html.replace('class="brand" href="./"','class="brand" href=""');
 html=html.replace('</head>',`<style>\n${css}\n</style>\n</head>`);
 html=html.replace('</body>',()=>[leafletJS,peerJS,result.outputFiles[0].text].map(code=>`<script>\n${inlineScript(code)}\n</script>`).join('\n')+'\n</body>');
 return html;
}

export async function exportHTML(output=resolve(project,'exports/tokyo-escape.html')){
 const html=await createSingleFileHTML();
 await mkdir(dirname(output),{recursive:true});
 await writeFile(output,html);
 console.log(`${output} (${Buffer.byteLength(html)} bytes)`);
 return output;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await exportHTML(process.argv[2]?resolve(process.argv[2]):undefined);
