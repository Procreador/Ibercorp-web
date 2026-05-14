export interface Property {
  id: string;
  title: string;
  address: string;
  ref: string;
  tag: string;
  price: string | number;
  m2?: number;
  beds?: number;
  baths?: number;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  reference?: string;
  year: string;
  description: string;
  features: string[];
  images: string[];
  zone: string;
}

export const heroSlides = [
  {
    image: "/img/hero-001.jpg",
    alt: "Madrid - Barrio de Salamanca",
  },
  {
    image: "/img/hero-002.jpg",
    alt: "Propiedad exclusiva",
  },
  {
    image: "/img/hero-003.jpg",
    alt: "Residencia de lujo",
  },
  {
    image: "/img/hero-004.jpg",
    alt: "Madrid patrimonio",
  },
];

export const properties: Property[] = [];

export const zones = [
  {
    id: "madrid-capital",
    name: "MADRID (CAPITAL)",
    description: "Madrid es uno de los mercados inmobiliarios más sólidos de Europa, con una demanda constante, alta seguridad jurídica y una oferta limitada en ubicaciones prime.",
    menuImage: "/img/menu_propiedades/Cibeles---Atardecer-Madrid.jpg",
    featured: true,
  },
  {
    id: "almagro",
    name: "Almagro",
    description: "Elegancia clásica y fincas señoriales en Chamberí.",
    menuImage: "/img/menu_propiedades/ptaalcala.jpg",
    parent: "madrid-capital",
  },
  {
    id: "salamanca",
    name: "Barrio de Salamanca",
    description: "El barrio más emblemático del lujo madrileño.",
    menuImage: "/img/menu_propiedades/bsalamanca.jpg",
    parent: "madrid-capital",
  },
  {
    id: "jeronimos",
    name: "Jerónimos",
    description: "Prestigio y patrimonio junto al Retiro.",
    menuImage: "/img/menu_propiedades/iStock-1489512945.jpg",
    parent: "madrid-capital",
  },
  {
    id: "justicia",
    name: "Justicia",
    description: "El barrio más bohemio y sofisticado de Madrid.",
    menuImage: "/img/menu_propiedades/ptaalcala.jpg",
    parent: "madrid-capital",
  },
  {
    id: "madrid-capital-otras",
    name: "Otras zonas",
    description: "Zonas de interés en el centro de la ciudad.",
    parent: "madrid-capital",
  },
  {
    id: "areas-residenciales",
    name: "Madrid - Áreas Residenciales",
    description: "Zonas residenciales premium a las afueras de la capital.",
    menuImage: "/img/menu_propiedades/ptaalcala.jpg",
  },
  {
    id: "la-moraleja",
    name: "La Moraleja",
    description: "La urbanización de lujo más famosa de Madrid.",
    parent: "areas-residenciales",
  },
  {
    id: "pozuelo",
    name: "Pozuelo de Alarcón",
    description: "Excelentes infraestructuras y calidad de vida para familias.",
    parent: "areas-residenciales",
  },
  {
    id: "zonas-costeras",
    name: "Zonas Costeras",
    description: "Propiedades exclusivas frente al mar.",
    menuImage: "/img/menu_propiedades/Zonas-Costeras.jpg",
  },
  {
    id: "otras-zonas",
    name: "Otras Zonas",
    description: "Otras ubicaciones estratégicas de interés.",
    menuImage: "/img/menu_propiedades/ptaalcala.jpg",
  },
  {
    id: "singulares",
    name: "Propiedades Singulares",
    description: "Inmuebles únicos por su arquitectura o ubicación.",
    menuImage: "/img/menu_propiedades/ptaalcala.jpg",
  },
];

export const LOGO_URL = "/img/logo-ibercorp-letrasnegras.gif";
export const LOGO_WHITE_URL = "/img/logo-ibercorp-letrasblancas.gif";
