export const translations = {
  pt: {
    nav: {
      produtos: 'PRODUTOS',
      contato: 'CONTATO',
    },
    hero: {
      slogan: 'SEM LIMITE',
      subtitle: 'Streetwear de luxo inspirado na cultura automotiva de alta performance',
      cta: 'Explorar Coleção',
    },
    products: {
      title: 'DROP 01',
      subtitle: 'Coleção Exclusiva',
      button: 'COMPRAR',
    },
    carousel: {
      title: 'LIFESTYLE',
    },
    footer: {
      title: 'CONTATO',
      subtitle: 'Entre em contato conosco',
      name: 'Nome',
      email: 'Email',
      message: 'Mensagem',
      send: 'ENVIAR',
      emailLabel: 'Email:',
      instagramLabel: 'Instagram:',
      rights: '© 2024 OVRDRV. Todos os direitos reservados.',
    },
  },
  en: {
    nav: {
      produtos: 'PRODUCTS',
      contato: 'CONTACT',
    },
    hero: {
      slogan: 'NO LIMITS',
      subtitle: 'Luxury streetwear inspired by high-performance automotive culture',
      cta: 'Explore Collection',
    },
    products: {
      title: 'DROP 01',
      subtitle: 'Exclusive Collection',
      button: 'BUY NOW',
    },
    carousel: {
      title: 'LIFESTYLE',
    },
    footer: {
      title: 'CONTACT',
      subtitle: 'Get in touch with us',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'SEND',
      emailLabel: 'Email:',
      instagramLabel: 'Instagram:',
      rights: '© 2024 OVRDRV. All rights reserved.',
    },
  },
};

export type Language = keyof typeof translations;
export type Translations = typeof translations.pt;
