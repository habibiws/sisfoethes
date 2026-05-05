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
    
    // Replace text color uses of navy
    let newContent = content.replace(/color:\s*var\(--navy\)/g, 'color: var(--navy-text)');
    newContent = newContent.replace(/color:\s*var\(--navy-light\)/g, 'color: var(--navy-text-light)');
    newContent = newContent.replace(/color:\s*#6B4700/g, 'color: var(--gold-text)');
    newContent = newContent.replace(/color:\s*#9A6B00/g, 'color: var(--gold-text-light)');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated text colors in: ' + filePath);
    }
  }
});
