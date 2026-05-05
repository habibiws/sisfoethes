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
    
    // Replace background colors
    let newContent = content.replace(/background:\s*white;/g, 'background: var(--white);');
    newContent = newContent.replace(/background:\s*#fff;/g, 'background: var(--white);');
    newContent = newContent.replace(/background:\s*#ffffff;/g, 'background: var(--white);');
    
    // Replace hardcoded light backgrounds to variables
    newContent = newContent.replace(/background:\s*#FAFAF8;/g, 'background: var(--bg2);');
    newContent = newContent.replace(/background:\s*#EBF2F9;/g, 'background: var(--bg2);');
    newContent = newContent.replace(/background:\s*#F1F5F9;/g, 'background: var(--bg2);');
    newContent = newContent.replace(/background:\s*#F8FAFC;/g, 'background: var(--bg);');

    // Replace color variables that are hardcoded
    newContent = newContent.replace(/color:\s*#475569;/g, 'color: var(--text2);');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated backgrounds in: ' + filePath);
    }
  }
});
