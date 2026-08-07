export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  body: string[];
  cover?: string;
  gallery?: string[];
  video?: string;
  external?: { label: string; href: string };
  meta: { label: string; value: string }[];
};

export const carrd = "https://bobbio-russian.carrd.co";

const gallery05 = (name: string) => `${carrd}/assets/images/gallery05/${name}.jpg?v=a4fe6713`;

export const beyondRenderingImages = [
  "3dc68b3a",
  "67b412b6",
  "ca81af8f",
  "ed2a2e65",
  "dfe4decc",
  "64adbfbf",
  "ece363b2",
  "de17d886",
  "52b6b7f2",
  "bb899910",
  "444cfd25",
  "46745c26",
  "95ecebf7",
  "7fb8a8d5",
  "6e7b2f89",
  "06c9815f",
  "de99dd07",
  "78d1582f",
  "71b2f81e",
].map(gallery05);

export const projects: Project[] = [
  {
    slug: "beyond-rendering",
    title: "Beyond Rendering",
    eyebrow: "Architectural visualization · Interiors",
    summary: "A visual archive where rendering acts as a design instrument for testing space, light, materials and atmosphere.",
    body: [
      "The work moves between spatial definition, material atmosphere and presentation. These images are not isolated illustrations: they form part of an iterative process used to test proportion, lighting, finishes and everyday experience.",
      "This first migration uses the real web-resolution material already published in the previous portfolio. The architecture of the new site is ready for higher-resolution originals to replace these copies progressively without changing the experience.",
    ],
    cover: gallery05("3dc68b3a"),
    gallery: beyondRenderingImages,
    meta: [
      { label: "Discipline", value: "Interior design / visualization" },
      { label: "Focus", value: "Space, materials, lighting" },
      { label: "Archive", value: "Selected residential studies" },
    ],
  },
  {
    slug: "oaya",
    title: "OAYA",
    eyebrow: "Urban resilience · Final thesis",
    summary: "A civic-wellbeing project in Petare, Caracas, using proximity, urban farming and collective care as instruments of regeneration.",
    body: [
      "Named after an indigenous Venezuelan word for Earth, OAYA rethinks vulnerable structures as a generative urban fabric. Architecture becomes shared infrastructure: a place where proximity, production and community life can reinforce one another.",
      "Urban farming and collaborative design form a living laboratory connecting local identity with productive systems. The project was developed at IED under the guidance of Manuel Monteserín and Santiago Bouzada Biurrun.",
    ],
    video: "https://player.vimeo.com/video/559607692?h=5a02e5a0b5&dnt=1",
    external: { label: "Watch on Vimeo", href: "https://vimeo.com/559607692" },
    meta: [
      { label: "Location", value: "Petare · Caracas" },
      { label: "Context", value: "IED · Final thesis" },
      { label: "Themes", value: "Community, urban farming, resilience" },
    ],
  },
  {
    slug: "architecture-of-sustenance",
    title: "The Architecture of Sustenance",
    eyebrow: "Bio-design · Productive architecture",
    summary: "A design direction where digital twins, bioclimatic strategies and food-production systems become part of the architectural fabric.",
    body: [
      "Every project begins with a digital twin so ideas can be tested and improved before construction. The objective is to create more efficient and sustainable solutions for each location.",
      "Bioclimatic design, hydroponic and aeroponic systems, advanced materials and Urban Ponics technologies are treated as parts of one productive habitat rather than separate technical layers.",
    ],
    cover: `${carrd}/assets/images/image03.png?v=a4fe6713`,
    video: "https://player.vimeo.com/video/1211006561?h=3526d55a15&dnt=1",
    external: { label: "Urban Ponics", href: "https://urbanponics.nl/" },
    meta: [
      { label: "Discipline", value: "Bio-design" },
      { label: "Focus", value: "Productive architecture" },
      { label: "Systems", value: "Bioclimatic · Hydroponic · Aeroponic" },
    ],
  },
];

export const capabilities = [
  { index: "01", title: "Capture", copy: "Site measurement, point clouds and high-fidelity spatial documentation using Leica and Proliner workflows." },
  { index: "02", title: "Design", copy: "Spatial planning, Total Living, premium kitchens, bespoke furniture, materials and technical development." },
  { index: "03", title: "Visualize", copy: "Real-time rendering, animation, VR and panoramic experiences through Twinmotion, D5, V-Ray and Unreal workflows." },
  { index: "04", title: "Deliver", copy: "Quotations, supplier coordination, manufacturing, installation, site supervision and client communication." },
];

export const ecosystem = [
  { name: "Febal Casa", href: "https://www.febalcasa.com/es/", relation: "Architectural design · luxury interiors" },
  { name: "Grupo TJC", href: "https://grupotjc.com/", relation: "Professional ecosystem" },
  { name: "Bontempi", href: "https://www.bontempi.it/es/", relation: "Design ecosystem" },
  { name: "Sola Cocinas", href: "https://solacocinas.com/", relation: "Kitchen design ecosystem" },
  { name: "Colombini Group", href: "https://www.colombinigroup.com/", relation: "Group ecosystem" },
  { name: "Urban Ponics", href: "https://urbanponics.nl/", relation: "Bio-design collaboration" },
];
