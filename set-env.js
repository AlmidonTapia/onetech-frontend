const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, './src/environments/environment.ts');

const isProd = process.env.VERCEL_ENV === 'production';
const apiUrl = process.env.API_URL || 'http://localhost:8080/api/v1';
const mpPublicKey = process.env.MP_PUBLIC_KEY || '';

const envConfigFile = `export const environment = {
  production: ${isProd},
  apiUrl: '${apiUrl}',
  mpPublicKey: '${mpPublicKey}'
};
`;

console.log('Generando archivo environment.ts de forma dinámica...');
const targetDir = path.dirname(targetPath);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
fs.writeFileSync(targetPath, envConfigFile);
console.log('Archivo environment.ts generado correctamente.');
