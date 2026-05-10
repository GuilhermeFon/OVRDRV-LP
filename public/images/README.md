# Hero Images

Coloque aqui as imagens estáticas da hero section:

- `hero-poster.jpg` — frame 1 do vídeo (portão fechado). Usado como `poster` do `<video>` e como loading state. Deve ser idêntico ao primeiro frame do MP4 para evitar "flash" quando o vídeo começa.
- `hero-fallback.jpg` — frame final (carro revelado). Usado em `prefers-reduced-motion: reduce` e em conexões 2g/slow-2g.

## Especificações recomendadas

- Resolução: 1920×1080 ou maior
- Formato: JPG progressivo, qualidade 80–85
- Tamanho: < 250 KB cada (para não bloquear o LCP)
