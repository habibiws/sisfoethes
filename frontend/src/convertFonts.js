const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(__dirname, function(filePath) {
  if (filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace font-size: 13px; with font-size: calc(13px * var(--font-scale, 1));
    // Be careful not to replace calc if it's already there
    const newContent = content.replace(/font-size:\s*(\d+(?:\.\d+)?)px/g, 'font-size: calc($1px * var(--font-scale, 1))');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
