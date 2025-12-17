const https = require('https');
const fs = require('fs');
const path = require('path');

// Lista de imagens para baixar
const images = [
    'https://ph3a-growth-accelerator.lovable.app/assets/logo-databusca-new-X428bv0z.png',
    'https://ph3a-growth-accelerator.lovable.app/assets/logo-datacubobi-new-BEH6FgGc.png',
    'https://ph3a-growth-accelerator.lovable.app/assets/logo-datadossie-new-B0ZBLjJR.png',
    'https://ph3a-growth-accelerator.lovable.app/assets/logo-datafraud-new-BSWYtVWO.png',
    'https://ph3a-growth-accelerator.lovable.app/assets/databusca-gray-bg-new-CVoIFcWs.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/databusca-screenshot-new-BKpR8rNr.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/databusca-rede-relacionamentos-jWKeWWrR.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/datacubobi-insights-pf-DojY8opS.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/datacubobi-insights-pj-DgEgUXAj.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/datacubobi-charts-illustration-v2-DL_xRZbK.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/datadossie-screen-profissional-DZ3D8oW0.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/datadossie-brain-sources-mmzKgg5S.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/datafraud-hero-bg-B44Tmdjj.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/datafraud-workflow-screenshot-tnr30pfM.jpg',
    'https://ph3a-growth-accelerator.lovable.app/assets/ph3a-navbar-DJ28DcWB.png'
];

// Cria pasta assets se não existir
if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
}

// Função para baixar uma imagem
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const filename = path.basename(url);
        const filePath = path.join('assets', filename);
        
        // Remove arquivo existente (pode estar corrompido)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        console.log(`Baixando: ${filename}...`);
        
        const file = fs.createWriteStream(filePath);
        
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (response) => {
            // Seguir redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                console.log(`  Redirect para: ${response.headers.location}`);
                file.close();
                fs.unlinkSync(filePath);
                downloadImage(response.headers.location)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            
            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(filePath);
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            
            const totalBytes = parseInt(response.headers['content-length'], 10);
            let downloadedBytes = 0;
            
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
            });
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                const stats = fs.statSync(filePath);
                console.log(`  ✓ Salvo: ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
                resolve(filename);
            });
            
            file.on('error', (err) => {
                file.close();
                fs.unlink(filePath, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            file.close();
            fs.unlink(filePath, () => {});
            reject(err);
        });
    });
}

// Baixa todas as imagens sequencialmente
async function downloadAll() {
    console.log('='.repeat(50));
    console.log('Iniciando download das imagens...');
    console.log('='.repeat(50));
    console.log('');
    
    let success = 0;
    let failed = 0;
    
    for (const url of images) {
        try {
            await downloadImage(url);
            success++;
        } catch (err) {
            console.log(`  ✗ Erro: ${err.message}`);
            failed++;
        }
    }
    
    console.log('');
    console.log('='.repeat(50));
    console.log(`Concluído! ${success} sucesso, ${failed} falhas`);
    console.log('='.repeat(50));
}

downloadAll();

