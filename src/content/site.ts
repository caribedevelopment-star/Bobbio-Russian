export type Media = { src?: string; alt: string; caption: string; tone: "stone" | "green" | "dark" };
export type Project = {
  slug: string; title: string; subtitle: string; disciplines: string[]; summary: string;
  cover: Media; featured: boolean; nextProject: string; status: string;
  process: { label: string; text: string }[]; credits: string[];
};

export const identity = {
  name: "Alessandro Bobbio Russian",
  title: "Architectural Designer · Luxury Interiors · Bio-Designer",
  secondary: "Creative Project Lead · Digital Visualization · Spatial Technology",
  location: "Madrid, Spain",
  statement: "Designing the transition from digital vision to physical experience.",
  linkedin: "https://www.linkedin.com/in/bobbiorussian/",
};

export const navigation = [
  ["Index", "/"], ["Work", "/work"], ["Practice", "/practice"],
  ["Bio-Design", "/bio-design"], ["Profile", "/profile"], ["Contact", "/contact"],
] as const;

export const projects: Project[] = [
  {
    slug: "beyond-rendering", title: "Beyond Rendering", subtitle: "Architectural visualization",
    disciplines: ["Visualization", "Architectural Design"],
    summary: "A study in architectural communication: moving beyond the single image to make spatial intent legible, atmospheric and experiential.",
    cover: { alt: "Spatial visualization study — original project media pending", caption: "Beyond Rendering / visualization", tone: "stone" },
    featured: true, status: "Portfolio record", nextProject: "oaya",
    process: [{ label: "Model", text: "Spatial information is organized as a navigable digital environment." }, { label: "Visualize", text: "Light, material and viewpoint communicate design intent." }, { label: "Experience", text: "The representation becomes a way to understand space." }],
    credits: ["Detailed project credits awaiting source confirmation."],
  },
  {
    slug: "oaya", title: "OAYA", subtitle: "Bio-design research",
    disciplines: ["Bio-Design", "Research"],
    summary: "A verified project in Alessandro’s bio-design body of work, presented as part of an ongoing inquiry into productive architecture and resilient environments.",
    cover: { alt: "OAYA research — original project media pending", caption: "OAYA / bio-design research", tone: "green" },
    featured: true, status: "Research record", nextProject: "architecture-of-sustenance",
    process: [{ label: "Observe", text: "The project begins with environmental and human needs." }, { label: "Design", text: "Architecture is considered as a connected system." }, { label: "Validate", text: "Performance and experience remain part of the design question." }],
    credits: ["Institution, date, role and collaborators awaiting source confirmation."],
  },
  {
    slug: "architecture-of-sustenance", title: "Architecture of Sustenance", subtitle: "Productive architecture research",
    disciplines: ["Bio-Design", "Productive Architecture"],
    summary: "A research project within the verified portfolio, examining architecture through the lens of sustenance, production and resilient urban systems.",
    cover: { alt: "Architecture of Sustenance — original project media pending", caption: "Architecture of Sustenance / research", tone: "dark" },
    featured: true, status: "Research record", nextProject: "beyond-rendering",
    process: [{ label: "System", text: "Food production is read as a spatial and urban question." }, { label: "Connect", text: "Environmental cycles and human occupation are considered together." }, { label: "Communicate", text: "The proposal makes a complex system understandable." }],
    credits: ["Date, institution and complete project credits awaiting source confirmation."],
  },
];

export const capabilities = [
  { stage: "Capture", value: "Read existing conditions", items: ["Site measurement", "Spatial documentation"] },
  { stage: "Design", value: "Turn constraints into spatial intent", items: ["Spatial design", "Technical development", "Material definition"] },
  { stage: "Visualize", value: "Make decisions visible", items: ["Architectural visualization", "Animation", "Real-time experiences"] },
  { stage: "Communicate", value: "Build shared understanding", items: ["Presentations", "Visual storytelling", "Project communication"] },
  { stage: "Deliver", value: "Coordinate matter and people", items: ["Supplier coordination", "Manufacturing coordination", "Installation", "Project delivery"] },
  { stage: "Bio-systems", value: "Design productive environments", items: ["Hydroponics", "Aeroponics", "Bioclimatic systems", "Digital twins", "Urban resilience"] },
];

export const ecosystem = [
  { name: "IED Madrid", relation: "Academic institution", context: "Interior Design formation in Madrid." },
  { name: "Urban Ponics", relation: "Professional ecosystem", context: "Bio-design, productive architecture and urban farming context." },
  { name: "Febal Casa", relation: "Professional ecosystem", context: "Luxury interiors and Total Living context." },
  { name: "Grupo TJC", relation: "Professional ecosystem", context: "Relationship details are retained for confirmation." },
  { name: "Bontempi", relation: "Brand ecosystem", context: "Furniture and interior-design context." },
  { name: "Colombini Group", relation: "Brand ecosystem", context: "Interior systems context." },
  { name: "Sola Cocinas", relation: "Professional ecosystem", context: "Kitchen and interior-design context." },
];

export const formation = [
  { title: "Civil Engineering", text: "Structural logic · Technical precision · Construction thinking" },
  { title: "Interior Design · IED Madrid", text: "Spatial experience · Human scale · Materiality · Furniture · Sustainable design" },
  { title: "Professional Formation", text: "Luxury interiors · Total Living · Bespoke systems · Manufacturing · Installation · Visualization" },
  { title: "Independent Research", text: "Productive architecture · Hydroponics · Aeroponics · Digital twins · Resilient systems" },
];
