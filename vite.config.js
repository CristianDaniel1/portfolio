import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Os ícones aparecem várias vezes na página; como arquivos, são baixados
    // uma vez e ficam em cache, em vez de se repetirem dentro do HTML.
    assetsInlineLimit: 0,
  },
});
