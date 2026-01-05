const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const extracted = root; // folder already is FE_Take-Home_Challenge_extracted
const outDir = path.join(process.cwd(), 'sketch_summary');
const assetsOut = path.join(process.cwd(), 'src', 'assets', 'sketch');

function ensure(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
ensure(outDir);
ensure(assetsOut);

function readJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf8')); }

// Document-level styles/swatches/fonts
const docPath = path.join(extracted, 'document.json');
const doc = readJSON(docPath);

const styles = {
  swatches: (doc.sharedSwatches && doc.sharedSwatches.objects) || [],
  layerTextStyles: (doc.layerTextStyles && doc.layerTextStyles.objects) || [],
  layerStyles: (doc.layerStyles && doc.layerStyles.objects) || [],
  fontReferences: doc.fontReferences || []
};

fs.writeFileSync(path.join(outDir, 'styles.json'), JSON.stringify(styles, null, 2));

// Traverse pages
const pagesDir = path.join(extracted, 'pages');
const pages = fs.readdirSync(pagesDir).filter(f=>f.endsWith('.json'));

function collectLayers(obj, out){
  if(!obj) return;
  const n = obj._class || obj.class || 'unknown';
  const record = {
    id: obj.do_objectID || obj.id || null,
    class: obj._class || obj.class || null,
    name: obj.name || null,
    visible: obj.isVisible !== undefined ? obj.isVisible : null
  };
  if(obj.string) record.text = obj.string;
  if(obj.attributedString && obj.attributedString.string) record.text = obj.attributedString.string;
  if(obj.frame) record.frame = obj.frame;
  out.push(record);
  const children = obj.layers || obj._children || obj.layers || [];
  if(Array.isArray(children) && children.length){
    children.forEach(ch=>collectLayers(ch, out));
  }
}

const pagesSummary = [];
for(const p of pages){
  try{
    const pj = readJSON(path.join(pagesDir, p));
    const pageName = pj.name || p;
    const layersOut = [];
    const top = pj.layers || pj.children || [];
    top.forEach(t => collectLayers(t, layersOut));
    pagesSummary.push({ file: p, name: pageName, layerCount: layersOut.length, layers: layersOut });
  }catch(e){
    console.error('err reading page', p, e.message);
  }
}

fs.writeFileSync(path.join(outDir, 'pages_layers.json'), JSON.stringify(pagesSummary, null, 2));

// Fonts: copy fonts folder if present
const fontsSrc = path.join(extracted, 'fonts');
if(fs.existsSync(fontsSrc)){
  ensure(path.join(assetsOut, 'fonts'));
  const fonts = fs.readdirSync(fontsSrc);
  fonts.forEach(f => {
    try{ fs.copyFileSync(path.join(fontsSrc, f), path.join(assetsOut, 'fonts', f)); }catch(err){ console.error('copy font err', err.message); }
  });
}

// Previews: copy images in previews/
const previewsSrc = path.join(extracted, 'previews');
if(fs.existsSync(previewsSrc)){
  ensure(path.join(assetsOut, 'previews'));
  const previews = fs.readdirSync(previewsSrc);
  previews.forEach(f => {
    try{ fs.copyFileSync(path.join(previewsSrc, f), path.join(assetsOut, 'previews', f)); }catch(err){ console.error('copy preview err', err.message); }
  });
}

console.log('Sketch parsing complete. Outputs in:', outDir, 'and assets in', assetsOut);
process.exit(0);
