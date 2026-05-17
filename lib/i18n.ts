export const translations = {
  pt: {
    nav: {
      produtos: 'PRODUTOS',
      manifesto: 'MANIFESTO',
      lookbook: 'LOOKBOOK',
      contato: 'CONTATO',
    },
    hero: {
      eyebrow: '— DROP #001 — ILLEGAL RACING CLUB —',
      slogan: 'SEM LIMITE',
      subtitle:
        'Streetwear inspirado na cultura automotiva real. Cada peça numerada, edição limitada.',
      cta: 'Explorar Coleção',
      ignite: 'ignite ?',
      scroll: 'SCROLL',
    },
    manifesto: {
      eyebrow: '— MANIFESTO —',
      title: 'NÃO É HYPE.\nÉ CULTURA.',
      lead:
        'OVRDRV nasce no escapamento, no posto às 2 da manhã, na rua que vive de motor turbinado. Streetwear pra quem mora na cena — não pra quem vê só por foto.',
      body:
        'Cada drop é numerado à mão. Edição limitada, sem reposição. Tuning, carspotting, hypercar — tudo entra no algodão e sai com assinatura.',
      mockupLabel: 'ILLEGAL RACING CLUB',
      mockupCaption: 'MOCKUP · OVERSIZED TEE',
      pillars: [
        { value: '001/100', label: 'Numerada à mão' },
        { value: 'DROP', label: 'Sem reposição' },
        { value: 'BR · SP', label: 'Cultura real' },
      ],
      cta: 'Ver Drop 01',
      signature: 'Sem Limite.',
    },
    products: {
      eyebrow: 'COLEÇÃO EXCLUSIVA',
      title: 'DROP 01',
      button: 'COMPRAR',
    },
    carousel: {
      eyebrow: 'CULTURA AUTOMOTIVA REAL',
      title: 'LIFESTYLE',
    },
    footer: {
      title: 'CONTATO',
      subtitle: 'Encontros, parcerias, custom orders. Chama no e-mail ou no direct.',
      name: 'Nome',
      email: 'Email',
      message: 'Mensagem',
      send: 'ENVIAR',
      sending: 'ENVIANDO...',
      sent: '✓ ENVIADO',
      emailLabel: 'E-mail',
      instagramLabel: 'Instagram',
      signature: 'Sem Limite.',
      rights: '© 2026 OVRDRV · TODOS OS DIREITOS RESERVADOS',
      cnpj: 'CNPJ 12.345.678/0001-X',
      location: 'SÃO PAULO · BR',
    },
  },
  en: {
    nav: {
      produtos: 'PRODUCTS',
      manifesto: 'MANIFESTO',
      lookbook: 'LOOKBOOK',
      contato: 'CONTACT',
    },
    hero: {
      eyebrow: '— DROP #001 — ILLEGAL RACING CLUB —',
      slogan: 'SEM LIMITE',
      subtitle:
        'Streetwear inspired by real street-car culture. Numbered pieces, limited edition.',
      cta: 'Explore Collection',
      ignite: 'ignite ?',
      scroll: 'SCROLL',
    },
    manifesto: {
      eyebrow: '— MANIFESTO —',
      title: "NOT HYPE.\nIT'S CULTURE.",
      lead:
        'OVRDRV starts at the exhaust, at the 2am gas station, on the streets that run on turbocharged engines. Streetwear for whoever lives the scene — not whoever sees it through a feed.',
      body:
        'Every drop is hand-numbered. Limited edition, no restocks. Tuning, carspotting, hypercars — it all goes into the cotton and comes out signed.',
      mockupLabel: 'ILLEGAL RACING CLUB',
      mockupCaption: 'MOCKUP · OVERSIZED TEE',
      pillars: [
        { value: '001/100', label: 'Hand-numbered' },
        { value: 'DROP', label: 'No restocks' },
        { value: 'BR · SP', label: 'Real culture' },
      ],
      cta: 'See Drop 01',
      signature: 'Sem Limite.',
    },
    products: {
      eyebrow: 'EXCLUSIVE COLLECTION',
      title: 'DROP 01',
      button: 'BUY',
    },
    carousel: {
      eyebrow: 'REAL CAR CULTURE',
      title: 'LIFESTYLE',
    },
    footer: {
      title: 'CONTACT',
      subtitle: 'Meetups, partnerships, custom orders. Hit us up by email or DM.',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'SEND',
      sending: 'SENDING...',
      sent: '✓ SENT',
      emailLabel: 'E-mail',
      instagramLabel: 'Instagram',
      signature: 'Sem Limite.',
      rights: '© 2026 OVRDRV · ALL RIGHTS RESERVED',
      cnpj: 'CNPJ 12.345.678/0001-X',
      location: 'SÃO PAULO · BR',
    },
  },
};

export type Language = keyof typeof translations;
export type Translations = typeof translations.pt;

export interface Product {
  name: string;
  price: string;
  meta: { pt: string; en: string };
  serial: string;
  image: string;
}

export const products: Product[] = [
  {
    name: 'Illegal Racing Club',
    price: '149,90',
    meta: { pt: 'Oversized · Black', en: 'Oversized · Black' },
    serial: '001/100',
    image: '/images/products/banner-1.png',
  },
  {
    name: 'Call to 911',
    price: '149,90',
    meta: { pt: 'Oversized · Natural', en: 'Oversized · Natural' },
    serial: '012/100',
    image: '/images/products/banner-2.png',
  },
  {
    name: 'Marea Bomb!',
    price: '149,90',
    meta: { pt: 'Oversized · Black', en: 'Oversized · Black' },
    serial: '024/100',
    image: '/images/products/banner-3.png',
  },
  {
    name: 'Uno Coat',
    price: '149,90',
    meta: { pt: 'Oversized · Natural', en: 'Oversized · Natural' },
    serial: '037/100',
    image: '/images/products/banner-4.png',
  },
];
