# Refatoração de Páginas HTML com Prefixo CSX

Este documento explica o processo de refatoração das páginas de produtos PH3A para uso com Bootstrap 5, evitando conflitos de classes CSS.

## 📋 Objetivo

Refatorar páginas HTML geradas pelo Lovable para integração em sites que usam Bootstrap 5, prefixando todas as classes CSS com `csx-` para evitar conflitos.

---

## 🔧 O que foi feito

### 1. Prefixação de Classes CSS

**Todas as classes foram prefixadas com `csx-`:**

| Antes | Depois |
|-------|--------|
| `class="flex items-center"` | `class="csx-flex csx-items-center"` |
| `class="bg-primary text-white"` | `class="csx-bg-primary csx-text-white"` |

**Modificadores responsivos e pseudo-classes preservados:**

| Antes | Depois |
|-------|--------|
| `sm:flex` | `sm:csx-flex` |
| `lg:grid-cols-2` | `lg:csx-grid-cols-2` |
| `hover:bg-primary` | `hover:csx-bg-primary` |

### 2. Remoção de Elementos

Os seguintes elementos foram removidos dos HTMLs:

- ❌ **Navbar** (`<nav>...</nav>`) - Menu de navegação do topo
- ❌ **Footer** (`<footer>...</footer>`) - Rodapé
- ❌ **Botão Flutuante** - FAB/Chat button no canto inferior direito
- ❌ **Tags `<script>`** - Scripts originais do framework
- ❌ **Tags `<style>`** - Estilos inline

### 3. Download de Imagens

Todas as imagens foram baixadas da URL original e salvas na pasta `assets/`:

```
assets/
├── logo-databusca-new-X428bv0z.png      (100.0 KB)
├── logo-datacubobi-new-BEH6FgGc.png     (84.5 KB)
├── logo-datadossie-new-B0ZBLjJR.png     (84.4 KB)
├── logo-datafraud-new-BSWYtVWO.png      (78.3 KB)
├── databusca-gray-bg-new-CVoIFcWs.jpg   (138.4 KB)
├── databusca-screenshot-new-BKpR8rNr.jpg (469.2 KB)
├── databusca-rede-relacionamentos-jWKeWWrR.jpg (613.4 KB)
├── datacubobi-insights-pf-DojY8opS.jpg  (363.0 KB)
├── datacubobi-insights-pj-DgEgUXAj.jpg  (346.3 KB)
├── datacubobi-charts-illustration-v2-DL_xRZbK.jpg (63.8 KB)
├── datadossie-screen-profissional-DZ3D8oW0.jpg (218.4 KB)
├── datadossie-brain-sources-mmzKgg5S.jpg (80.9 KB)
├── datafraud-hero-bg-B44Tmdjj.jpg       (135.3 KB)
├── datafraud-workflow-screenshot-tnr30pfM.jpg (209.8 KB)
└── ph3a-navbar-DJ28DcWB.png             (48.8 KB)
```

**URLs atualizadas:**
- Antes: `https://ph3a-growth-accelerator.lovable.app/assets/...`
- Depois: `assets/...`

#### ⚠️ Problema Conhecido: Imagens Corrompidas

O script `refactor-produtos.js` pode baixar imagens corrompidas (arquivos com 0 bytes ou inválidos). Isso acontece porque o download é feito de forma simples sem tratamento adequado de headers.

**Solução:** Use o script dedicado `download-images.js`:

```bash
cd produtos
node download-images.js
```

Este script:
- Remove arquivos existentes (possivelmente corrompidos)
- Usa headers corretos (User-Agent)
- Mostra o tamanho de cada arquivo baixado
- Segue redirects automaticamente

### 4. Animações de Scroll

Foi criado o arquivo `scroll-animations.js` para replicar as animações originais:

- Detecta elementos com `opacity: 0` ou `opacity: 1; transform: none` no style inline
- Usa `IntersectionObserver` para detectar quando elementos entram na viewport
- Aplica transições suaves de fade-in

---

## 📁 Estrutura de Arquivos

```
produtos/
├── index.html              # Página de navegação
├── index-csx.css           # CSS com classes prefixadas
├── scroll-animations.js    # Script de animações
├── refactor-produtos.js    # Script de refatoração (Node.js)
├── download-images.js      # Script para baixar imagens (Node.js)
├── readme-csx.md           # Esta documentação
│
├── databusca-csx.html      # Páginas refatoradas
├── datacubobi-csx.html
├── datadossie-csx.html
├── datafraud-csx.html
│
├── databusca.html          # Páginas originais
├── datacubobi.html
├── datadossie.html
├── datafraud.html
│
└── assets/                 # Imagens
    ├── logo-*.png
    └── *.jpg
```

---

## 🚀 Como Refatorar um Novo HTML

### Opção 1: Usando o Script Automático

1. **Coloque o arquivo HTML original** na pasta `produtos/`

2. **Adicione o nome do arquivo** ao array `htmlFiles` no `refactor-produtos.js`:

```javascript
const htmlFiles = [
    'databusca.html',
    'datacubobi.html',
    'datadossie.html',
    'datafraud.html',
    'novo-arquivo.html'  // ← Adicione aqui
];
```

3. **Execute o script:**

```bash
cd produtos
node refactor-produtos.js
```

4. **Resultado:** Será criado `novo-arquivo-csx.html` com todas as transformações aplicadas.

### Opção 2: Refatoração Manual

Se preferir fazer manualmente:

1. **Prefixar classes no HTML:**
   - Abra o arquivo HTML
   - Use Find & Replace com regex:
     - Buscar: `class="([^"]+)"`
     - Substituir cada classe por `csx-` + classe original
   - Cuidado com modificadores: `sm:flex` → `sm:csx-flex`

2. **Prefixar classes no CSS:**
   - Buscar: `\.([a-zA-Z])`
   - Substituir: `.csx-$1`
   - Cuidado com modificadores escapados: `.sm\:flex` → `.sm\:csx-flex`

3. **Remover elementos:**
   - Deletar `<nav>...</nav>`
   - Deletar `<footer>...</footer>`
   - Deletar `<button class="...fixed...">...</button>` (FAB)
   - Deletar `<script>...</script>`
   - Deletar `<style>...</style>`

4. **Atualizar referências:**
   - CSS: `href="index-csx.css"`
   - Imagens: baixar para `assets/` e atualizar URLs

5. **Adicionar script de animações:**
   ```html
   <script src="scroll-animations.js"></script>
   </body>
   ```

---

## 📝 Regras de Prefixação

### ✅ O que DEVE ser prefixado:

- Classes CSS: `.flex` → `.csx-flex`
- Classes com modificadores: `sm:flex` → `sm:csx-flex`
- Pseudo-classes: `hover:bg-primary` → `hover:csx-bg-primary`

### ❌ O que NÃO deve ser prefixado:

- Tags HTML: `<div>`, `<section>`, etc.
- IDs: `id="root"`
- Data attributes: `data-*`
- Inline styles: `style="..."`
- URLs: `src="..."`, `href="..."`
- Variáveis CSS: `--tw-*`, `var(--*)`
- @keyframes, @import, @media
- Valores CSS: `rgb()`, `hsl()`, `px`, `rem`

---

## 🎨 Sobre o CSS (index-csx.css)

O arquivo CSS contém todas as classes Tailwind usadas nas páginas, já prefixadas com `csx-`.

**Importante:** O CSS inclui:
- Reset/normalize
- Classes utilitárias Tailwind
- Variáveis CSS de tema (cores, radius, etc.)
- Media queries responsivas
- Animações e transições

---

## ⚡ Sobre as Animações (scroll-animations.js)

O script detecta automaticamente elementos que precisam de animação:

```javascript
// Elementos com opacity: 0 no style inline
<div style="opacity: 0; transform: translateY(30px);">

// Elementos com opacity: 1; transform: none (já animados no original)
<div style="opacity: 1; transform: none;">
```

**Configuração:**
- `threshold: 0.05` - 5% visível para disparar
- `rootMargin: '100px'` - começa 100px antes de aparecer
- `duration: 600ms` - duração da animação
- `staggerDelay: 80ms` - delay entre elementos em grupo

---

## 🔍 Verificação

Após refatorar, verifique:

- [ ] Todas as classes têm prefixo `csx-`
- [ ] Modificadores preservados (`sm:csx-`, `hover:csx-`, etc.)
- [ ] Navbar, footer e FAB removidos
- [ ] Imagens apontando para `assets/`
- [ ] Script de animações incluído
- [ ] CSS referenciando `index-csx.css`
- [ ] Página carrega sem erros no console

---

## 🛠️ Troubleshooting

### Imagens não carregam / aparecem corrompidas

**Problema:** As imagens na pasta `assets/` não abrem ou mostram erro.

**Solução:**
```bash
cd produtos
node download-images.js
```

O script vai re-baixar todas as imagens corretamente.

---

### Elementos ficam invisíveis (opacity: 0)

**Problema:** Algumas seções da página ficam em branco mesmo após scroll.

**Causa:** Os HTMLs originais têm elementos com `style="opacity: 0; transform: translateY(30px);"` que precisam ser animados via JavaScript.

**Solução:** 
1. Verifique se o `scroll-animations.js` está incluído antes do `</body>`:
   ```html
   <script src="scroll-animations.js"></script>
   </body>
   ```

2. Abra o console do navegador (F12) e verifique se aparece:
   ```
   Found X elements to animate
   ✓ Scroll animations initialized for X elements
   ```

3. Se o número de elementos for 0, o script não encontrou elementos para animar.

---

### Animações não funcionam em alguns elementos

**Problema:** A maioria das animações funciona, mas alguns elementos continuam invisíveis.

**Causa:** O script procura por elementos com `opacity` no style inline. Se o elemento não tem esse atributo, não será animado.

**Solução:** O `scroll-animations.js` busca por:
- `style="opacity: 0; ..."` - elementos escondidos
- `style="opacity: 1; transform: none;"` - elementos já animados no original

Se o elemento usa outra forma de esconder (display: none, visibility: hidden), não será detectado.

---

### CSS não carrega / página sem estilo

**Problema:** A página aparece sem formatação.

**Solução:**
1. Verifique se o `<link>` no `<head>` aponta para o arquivo correto:
   ```html
   <link rel="stylesheet" href="index-csx.css">
   ```

2. Verifique se o arquivo `index-csx.css` existe na mesma pasta do HTML.

---

### Classes Bootstrap conflitando

**Problema:** Estilos do Bootstrap interferem na página CSX.

**Causa:** Alguma classe não foi prefixada corretamente.

**Solução:**
1. Busque no HTML por classes sem o prefixo `csx-`
2. Use o console do navegador para inspecionar o elemento problemático
3. Verifique se a classe no CSS tem o prefixo `.csx-`

---

## 📞 Suporte

Em caso de dúvidas sobre o processo de refatoração, consulte:
- Este documento (`readme-csx.md`)
- O script `refactor-produtos.js` para ver a lógica completa
- O script `download-images.js` para baixar imagens
- O arquivo `REFACTORING_PROCESS.md` na pasta raiz (documentação geral)

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| `refactor-produtos.js` | `node refactor-produtos.js` | Processa HTMLs: prefixa classes, remove elementos, atualiza URLs |
| `download-images.js` | `node download-images.js` | Baixa todas as imagens para a pasta `assets/` |

**Ordem recomendada para novos arquivos:**
1. Coloque o HTML original na pasta
2. Adicione ao array `htmlFiles` no `refactor-produtos.js`
3. Execute `node refactor-produtos.js`
4. Execute `node download-images.js` (se tiver novas imagens)
5. Teste a página no navegador

