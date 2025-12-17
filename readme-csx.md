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
├── logo-databusca-new-X428bv0z.png
├── logo-datacubobi-new-BEH6FgGc.png
├── logo-datadossie-new-B0ZBLjJR.png
├── logo-datafraud-new-BSWYtVWO.png
├── databusca-gray-bg-new-CVoIFcWs.jpg
├── databusca-screenshot-new-BKpR8rNr.jpg
├── databusca-rede-relacionamentos-jWKeWWrR.jpg
├── datacubobi-insights-pf-DojY8opS.jpg
├── datacubobi-insights-pj-DgEgUXAj.jpg
├── datacubobi-charts-illustration-v2-DL_xRZbK.jpg
├── datadossie-screen-profissional-DZ3D8oW0.jpg
├── datadossie-brain-sources-mmzKgg5S.jpg
├── datafraud-hero-bg-B44Tmdjj.jpg
└── datafraud-workflow-screenshot-tnr30pfM.jpg
```

**URLs atualizadas:**
- Antes: `https://ph3a-growth-accelerator.lovable.app/assets/...`
- Depois: `assets/...`

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

## 📞 Suporte

Em caso de dúvidas sobre o processo de refatoração, consulte:
- Este documento (`readme-csx.md`)
- O script `refactor-produtos.js` para ver a lógica completa
- O arquivo `REFACTORING_PROCESS.md` na pasta raiz (documentação geral)

