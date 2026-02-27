export interface Property {
  id: string;
  title: string;
  address: string;
  ref: string;
  tag: string;
  price: string;
  m2: number;
  beds: number;
  baths: number;
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

export const properties: Property[] = [
  {
    id: "ayala-10",
    title: "Piso Señorial en Calle Ayala",
    address: "Ayala 10, Barrio de Salamanca",
    ref: "REF AY-010",
    tag: "REFORMADO",
    price: "Precio a consultar",
    m2: 220,
    beds: 4,
    baths: 4,
    year: "1960",
    zone: "salamanca",
    description: "Espectacular piso señorial en la emblemática Calle Ayala del Barrio de Salamanca. Esta propiedad de 220 m² combina la arquitectura clásica madrileña con acabados contemporáneos de máxima calidad. Distribuido en 4 dormitorios y 4 baños, destaca por sus techos altos, molduras originales y una luminosidad excepcional. Reforma integral realizada con criterio patrimonial, preservando los elementos arquitectónicos de valor histórico.",
    features: [
      "Techos altos originales (3.5m)",
      "Molduras y detalles arquitectónicos preservados",
      "Reforma integral de calidad",
      "Luz natural excepcional",
      "Parquet de madera noble",
      "Sistemas de climatización modernos",
      "Acceso a patio comunitario",
    ],
    images: [
      "/img/propiedades/ayala10/ayala 10 (1).JPG",
      "/img/propiedades/ayala10/ayala 10 (2).JPG",
      "/img/propiedades/ayala10/ayala 10 (3).JPG",
      "/img/propiedades/ayala10/ayala 10 (4).JPG",
      "/img/propiedades/ayala10/ayala 10 (5).JPG",
      "/img/propiedades/ayala10/ayala 10 (6).JPG",
      "/img/propiedades/ayala10/ayala 10 (7).JPG",
      "/img/propiedades/ayala10/ayala 10 (8).JPG",
      "/img/propiedades/ayala10/ayala 10 (9).JPG",
      "/img/propiedades/ayala10/ayala 10 (10).JPG",
      "/img/propiedades/ayala10/ayala 10 (11).JPG",
      "/img/propiedades/ayala10/ayala 10 (12).JPG",
      "/img/propiedades/ayala10/ayala 10 (13).JPG",
      "/img/propiedades/ayala10/ayala 10 (14).JPG",
    ],
  },
  {
    id: "ayala-45",
    title: "Piso de Lujo en Ayala 45",
    address: "Ayala 45, 4º Dcha. 28001 Madrid",
    ref: "REF AY-045",
    tag: "PREMIUM",
    price: "5.695.000 €",
    m2: 323,
    beds: 3,
    baths: 3,
    year: "1970",
    zone: "salamanca",
    description: "Excepcional piso de lujo de 323 m² en la mejor ubicación de Ayala. Esta propiedad representa el máximo exponente de la vida en el Barrio de Salamanca, con amplios espacios, acabados premium y vistas privilegiadas. Distribuido en 3 dormitorios y 3 baños completos, ofrece una experiencia de vida incomparable con servicios de portería 24 horas y acceso a zonas comunes exclusivas.",
    features: [
      "323 m² de superficie",
      "Salón de 60 m² con vistas",
      "Cocina profesional integrada",
      "3 dormitorios en suite",
      "Suelos de mármol italiano",
      "Calefacción por radiadores de diseño",
      "Portería 24 horas",
      "Zonas comunes exclusivas",
    ],
    images: [
      "/img/propiedades/ayala45/001 (1).jpg",
      "/img/propiedades/ayala45/001 (2).jpg",
      "/img/propiedades/ayala45/001 (3).jpg",
      "/img/propiedades/ayala45/001 (4).jpg",
      "/img/propiedades/ayala45/001 (5).jpg",
      "/img/propiedades/ayala45/001 (6).jpg",
      "/img/propiedades/ayala45/001 (7).jpg",
      "/img/propiedades/ayala45/001 (8).jpg",
      "/img/propiedades/ayala45/001 (9).jpg",
      "/img/propiedades/ayala45/001 (10).jpg",
      "/img/propiedades/ayala45/001 (11).jpg",
      "/img/propiedades/ayala45/001 (12).jpg",
      "/img/propiedades/ayala45/001 (13).jpg",
      "/img/propiedades/ayala45/001 (14).jpg",
      "/img/propiedades/ayala45/001 (15).jpg",
    ],
  },
  {
    id: "nunez-balboa-85",
    title: "Apartamento en Núñez de Balboa",
    address: "Núñez de Balboa 85, 4ºF. 28001 Madrid",
    ref: "REF NB-085",
    tag: "CON GARAJE",
    price: "2.450.000 €",
    m2: 136,
    beds: 2,
    baths: 2,
    year: "1980",
    zone: "salamanca",
    description: "Elegante apartamento de 136 m² en la prestigiosa Calle Núñez de Balboa, en pleno corazón del Barrio de Salamanca. Distribuido en 2 dormitorios y 2 baños, ofrece una distribución óptima con amplios espacios y excelente iluminación. Incluye plaza de garaje privada, un valor añadido en esta zona de Madrid.",
    features: [
      "136 m² bien distribuidos",
      "2 dormitorios amplios",
      "2 baños completos",
      "Plaza de garaje privada",
      "Cocina equipada",
      "Salón-comedor luminoso",
      "Aire acondicionado",
      "Ascensor moderno",
    ],
    images: [
      "/img/propiedades/nunezbalboa85/001 (1).jpg",
      "/img/propiedades/nunezbalboa85/001 (2).jpg",
      "/img/propiedades/nunezbalboa85/001 (3).jpg",
      "/img/propiedades/nunezbalboa85/001 (4).jpg",
      "/img/propiedades/nunezbalboa85/001 (5).jpg",
      "/img/propiedades/nunezbalboa85/001 (6).jpg",
      "/img/propiedades/nunezbalboa85/001 (7).jpg",
      "/img/propiedades/nunezbalboa85/001 (8).jpg",
      "/img/propiedades/nunezbalboa85/001 (9).jpg",
    ],
  },
  {
    id: "lopez-hoyos-11",
    title: "Vivienda en López de Hoyos",
    address: "López de Hoyos 11, 3º Izq. 28002 Madrid",
    ref: "REF LH-011",
    tag: "CÉNTRICA",
    price: "1.850.000 €",
    m2: 165,
    beds: 3,
    baths: 2,
    year: "1975",
    zone: "madrid-capital",
    description: "Acogedora vivienda de 165 m² en la Calle López de Hoyos, zona de gran demanda en Madrid. Con 3 dormitorios y 2 baños, destaca por su distribución funcional y luminosidad. Ubicación estratégica con acceso fácil a transporte público, comercios y servicios. Perfecta para familias que buscan comodidad en zona céntrica.",
    features: [
      "165 m² de superficie",
      "3 dormitorios",
      "2 baños",
      "Cocina independiente",
      "Salón comedor amplio",
      "Balcón con vistas",
      "Zona de trastero",
      "Fácil acceso a transporte",
    ],
    images: [
      "/img/propiedades/lopezhoyos11/001 (1).jpg",
      "/img/propiedades/lopezhoyos11/001 (2).jpg",
      "/img/propiedades/lopezhoyos11/001 (3).jpg",
      "/img/propiedades/lopezhoyos11/001 (4).jpg",
      "/img/propiedades/lopezhoyos11/001 (5).jpg",
      "/img/propiedades/lopezhoyos11/001 (6).jpg",
      "/img/propiedades/lopezhoyos11/001 (7).jpg",
      "/img/propiedades/lopezhoyos11/001 (8).jpg",
      "/img/propiedades/lopezhoyos11/001 (9).jpg",
      "/img/propiedades/lopezhoyos11/001 (10).jpg",
      "/img/propiedades/lopezhoyos11/001 (11).jpg",
      "/img/propiedades/lopezhoyos11/001 (12).jpg",
      "/img/propiedades/lopezhoyos11/001 (13).jpg",
    ],
  },
  {
    id: "atico-maldonado",
    title: "Ático en Calle Maldonado",
    address: "Calle Maldonado, 28002 Madrid",
    ref: "REF AT-001",
    tag: "ÁTICO EXCLUSIVO",
    price: "3.200.000 €",
    m2: 280,
    beds: 3,
    baths: 3,
    year: "1985",
    zone: "madrid-capital",
    description: "Excepcional ático de 280 m² con terraza privada de 120 m² en la Calle Maldonado. Esta propiedad singular ofrece vistas panorámicas de Madrid, luz natural excepcional y una distribución de lujo. Con 3 dormitorios en suite y 3 baños, representa la máxima expresión del vivir en altura con todas las comodidades.",
    features: [
      "280 m² interiores + 120 m² terraza",
      "Vistas panorámicas de Madrid",
      "3 dormitorios en suite",
      "3 baños de diseño",
      "Cocina profesional",
      "Salón doble altura",
      "Terraza con pérgola",
      "Sistema domótico",
      "Calefacción por suelo radiante",
    ],
    images: [
      "/img/hero-002.jpg",
      "/img/hero-003.jpg",
      "/img/hero-004.jpg",
      "/img/hero-001.jpg",
    ],
  },
];

export const zones = [
  {
    id: "madrid-capital",
    name: "Madrid (Capital)",
    description: "Propiedades en el centro de Madrid",
  },
  {
    id: "almagro",
    name: "Almagro",
    description: "Barrio residencial de prestigio",
  },
  {
    id: "salamanca",
    name: "Barrio de Salamanca",
    description: "La zona más exclusiva de Madrid",
  },
  {
    id: "jeronimos",
    name: "Jerónimos",
    description: "Junto al Retiro y los museos",
  },
  {
    id: "justicia",
    name: "Justicia",
    description: "Centro histórico y cultural",
  },
  {
    id: "areas-residenciales",
    name: "Madrid · Áreas Residenciales",
    description: "Zonas residenciales premium",
  },
  {
    id: "la-moraleja",
    name: "La Moraleja",
    description: "Urbanización de lujo",
  },
  {
    id: "pozuelo",
    name: "Pozuelo de Alarcón",
    description: "Residencial y familiar",
  },
  {
    id: "zonas-costeras",
    name: "Zonas Costeras",
    description: "Propiedades en la costa",
  },
  {
    id: "otras-zonas",
    name: "Otras Zonas",
    description: "Otras ubicaciones de interés",
  },
  {
    id: "singulares",
    name: "Propiedades Singulares",
    description: "Propiedades únicas y exclusivas",
  },
];

export const LOGO_URL = "/img/logo-transparent.png";
export const LOGO_WHITE_URL = "/img/logo-white-transparent.png";
