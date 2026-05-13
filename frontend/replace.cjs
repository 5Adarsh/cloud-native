const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('localhost:8080')) {
    content = content.replace(/import React.*?;\r?\n/, match => match + "import { API_URL } from '../config';\n");
    
    // Replace 'http://localhost:8080...'
    content = content.replace(/'http:\/\/localhost:8080([^']+)'/g, '`${API_URL}$1`');
    // Replace `http://localhost:8080...`
    content = content.replace(/`http:\/\/localhost:8080([^`]+)`/g, '`${API_URL}$1`');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}
