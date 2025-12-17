const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const BASE_URL = 'https://ph3a-growth-accelerator.lovable.app';

// Lista de arquivos HTML para processar
const htmlFiles = [
    'databusca.html',
    'datacubobi.html',
    'datadossie.html',
    'datafraud.html'
];

// Cria pasta assets se não existir
if (!fs.existsSync('assets')) {
    fs.mkdirSync('assets');
}

// Função para baixar imagem
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join('assets', filename);
        
        // Verifica se já existe
        if (fs.existsSync(filePath)) {
            console.log(`    - Já existe: ${filename}`);
            resolve(filename);
            return;
        }
        
        const protocol = url.startsWith('https') ? https : http;
        
        const file = fs.createWriteStream(filePath);
        protocol.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Seguir redirect
                downloadImage(response.headers.location, filename)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`    ✓ Baixado: ${filename}`);
                resolve(filename);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.log(`    ✗ Erro ao baixar ${filename}: ${err.message}`);
            reject(err);
        });
    });
}

// Função para extrair nome do arquivo da URL
function getFilenameFromUrl(url) {
    const urlParts = url.split('/');
    let filename = urlParts[urlParts.length - 1];
    // Remove query string se houver
    filename = filename.split('?')[0];
    return filename;
}

// Função para remover elementos antes de prefixar
function removeElements(html) {
    // Remove tags <script>
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Remove tags <style>
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove a navbar completa (antes de prefixar, usa classes originais)
    html = html.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
    
    // Remove o footer completo
    html = html.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
    
    // Remove o botão flutuante (button com fixed bottom-6)
    html = html.replace(/<button[^>]*class="[^"]*fixed[^"]*bottom-6[^"]*"[^>]*>[\s\S]*?<\/button>/gi, '');
    
    // Remove atributos desnecessários
    html = html.replace(/\s*cz-shortcut-listen="true"/g, '');
    html = html.replace(/<meta id="[^"]*">/g, '');
    
    return html;
}

// Função para prefixar classes no HTML
function prefixHtmlClasses(html) {
    // Prefixar classes nos atributos class=""
    html = html.replace(/class="([^"]+)"/g, (match, classes) => {
        const prefixedClasses = classes.split(/\s+/).map(cls => {
            if (!cls || cls.startsWith('csx-')) return cls;
            
            // Trata classes com modificadores como sm:, lg:, hover:, etc.
            if (cls.includes(':')) {
                const parts = cls.split(':');
                const lastPart = parts.pop();
                const modifiers = parts.join(':');
                return `${modifiers}:csx-${lastPart}`;
            }
            
            return `csx-${cls}`;
        }).filter(c => c).join(' ');
        
        return `class="${prefixedClasses}"`;
    });
    
    return html;
}

// Função para extrair URLs de imagens do HTML
function extractImageUrls(html) {
    const urls = new Set();
    
    // src="url"
    const srcMatches = html.match(/src="([^"]+)"/g) || [];
    srcMatches.forEach(match => {
        const url = match.match(/src="([^"]+)"/)[1];
        if (url.includes('/assets/') && !url.startsWith('assets/')) {
            urls.add(url);
        }
    });
    
    // url("url") ou url(&quot;url&quot;)
    const bgMatches = html.match(/background-image:\s*url\([^)]+\)/g) || [];
    bgMatches.forEach(match => {
        let url = match.replace(/background-image:\s*url\(["']?|["']?\)/g, '');
        url = url.replace(/&quot;/g, '');
        if (url.includes('/assets/') && !url.startsWith('assets/')) {
            urls.add(url);
        }
    });
    
    return Array.from(urls);
}

// Função para atualizar URLs de imagens para pasta local
function updateImageUrls(html, urlMap) {
    for (const [originalUrl, localPath] of Object.entries(urlMap)) {
        // Escape special chars para regex
        const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        html = html.replace(new RegExp(escapedUrl, 'g'), localPath);
    }
    return html;
}

// Função para prefixar classes no CSS
function prefixCssClasses(css) {
    // Não prefixar @import
    const importMatch = css.match(/@import[^;]+;/g) || [];
    let processedCss = css;
    
    // Temporariamente remove @import para não ser processado
    importMatch.forEach((imp, i) => {
        processedCss = processedCss.replace(imp, `__IMPORT_${i}__`);
    });
    
    // Prefixar seletores de classe
    processedCss = processedCss.replace(/\.([a-zA-Z_][a-zA-Z0-9_-]*(?:\\[:\\/\[\]\.][a-zA-Z0-9_-]*)*)/g, (match, className) => {
        if (className.startsWith('csx-')) return match;
        
        // Trata classes com modificadores escapados como sm\:, hover\:
        if (className.includes('\\:')) {
            const parts = className.split('\\:');
            const lastPart = parts.pop();
            const modifiers = parts.join('\\:');
            return `.${modifiers}\\:csx-${lastPart}`;
        }
        
        return `.csx-${className}`;
    });
    
    // Restaura @import
    importMatch.forEach((imp, i) => {
        processedCss = processedCss.replace(`__IMPORT_${i}__`, imp);
    });
    
    return processedCss;
}

// Função para formatar/indentar HTML
function formatHtml(html) {
    const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse'];
    
    // Primeiro, adiciona quebras de linha após > e antes de <
    html = html.replace(/>\s*</g, '>\n<');
    
    let result = '';
    let indent = 0;
    const indentStr = '    ';
    const lines = html.split('\n');
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        // Tag de fechamento
        if (line.startsWith('</')) {
            indent = Math.max(0, indent - 1);
            result += indentStr.repeat(indent) + line + '\n';
        }
        // Tag de abertura
        else if (line.startsWith('<')) {
            result += indentStr.repeat(indent) + line + '\n';
            
            // Verifica se é tag auto-fechante
            const tagMatch = line.match(/^<([a-zA-Z0-9]+)/);
            const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
            const isSelfClosing = selfClosingTags.includes(tagName) || line.endsWith('/>') || line.includes(`</${tagName}>`);
            
            if (!isSelfClosing && !line.includes('</')) {
                indent++;
            }
        }
        // Texto
        else {
            result += indentStr.repeat(indent) + line + '\n';
        }
    }
    
    return result;
}

// Função principal assíncrona
async function main() {
    console.log('Iniciando processamento dos arquivos...\n');
    
    // Coleta todas as URLs de imagens de todos os HTMLs
    const allImageUrls = new Set();
    
    htmlFiles.forEach(file => {
        try {
            const html = fs.readFileSync(file, 'utf8');
            const urls = extractImageUrls(html);
            urls.forEach(url => allImageUrls.add(url));
        } catch (err) {
            console.error(`Erro ao ler ${file}:`, err.message);
        }
    });
    
    console.log(`Encontradas ${allImageUrls.size} imagens para baixar...\n`);
    
    // Baixa todas as imagens
    const urlMap = {};
    for (const url of allImageUrls) {
        const filename = getFilenameFromUrl(url);
        try {
            await downloadImage(url, filename);
            urlMap[url] = `assets/${filename}`;
        } catch (err) {
            // Mantém URL original se falhar
            urlMap[url] = url;
        }
    }
    
    console.log('\nProcessando arquivos HTML...\n');
    
    // Processa cada arquivo HTML
    htmlFiles.forEach(file => {
        try {
            const inputPath = file;
            const outputPath = file.replace('.html', '-csx.html');
            
            console.log(`Processando ${file}...`);
            
            // Lê o arquivo HTML
            let html = fs.readFileSync(inputPath, 'utf8');
            
            // 1. Remove elementos indesejados PRIMEIRO (antes de prefixar)
            html = removeElements(html);
            
            // 2. Atualiza URLs de imagens para pasta local
            html = updateImageUrls(html, urlMap);
            
            // 3. Prefixar classes
            html = prefixHtmlClasses(html);
            
            // 4. Atualiza referência do CSS
            html = html.replace(/href="\/assets\/index-DbTt_uwm\.css"/, 'href="index-csx.css"');
            html = html.replace(/href="[^"]*index-DbTt_uwm\.css"/, 'href="index-csx.css"');
            
            // 5. Adiciona script de animações antes do </body>
            html = html.replace(/<\/body>/i, '<script src="scroll-animations.js"></script>\n</body>');
            
            // 6. Formata o HTML
            html = formatHtml(html);
            
            // Salva o arquivo processado
            fs.writeFileSync(outputPath, html);
            console.log(`  ✓ Criado: ${outputPath}`);
            
        } catch (err) {
            console.error(`  ✗ Erro ao processar ${file}:`, err.message);
        }
    });
    
    // Processa o arquivo CSS
    console.log('\nProcessando CSS...');
    try {
        const css = fs.readFileSync('index-DbTt_uwm.css', 'utf8');
        const prefixedCss = prefixCssClasses(css);
        fs.writeFileSync('index-csx.css', prefixedCss);
        console.log('  ✓ Criado: index-csx.css');
    } catch (err) {
        console.error('  ✗ Erro ao processar CSS:', err.message);
    }
    
    console.log('\n✅ Processamento concluído!');
}

main().catch(console.error);
