const skillIcon = (slug) => `https://skillicons.dev/icons?i=${slug}&theme=dark`;
const simpleIcon = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
const iconifyIcon = (icon, color = "6ee7b7") => `https://api.iconify.design/${icon}.svg?color=%23${color}`;

const stackItems = [

  {
    label: "PostgresDB",
    imageUrl: skillIcon("postgres"),
  },
  {
    label: "Git",
    imageUrl: skillIcon("git"),
  },
  {
    label: "CI/CD",
    imageUrl: skillIcon("githubactions"),
  },
  {
    label: "Ubuntu",
    imageUrl: skillIcon("ubuntu"),
  },
  {
    label: "Docker",
    imageUrl: skillIcon("docker"),
  },
  {
    label: "Kubernetes",
    imageUrl: skillIcon("kubernetes"),
  },
  {
    label: "Redis",
    imageUrl: skillIcon("redis"),
  },
  {
    label: "AWS",
    imageUrl: skillIcon("aws"),
  },
  {
    label: "Python",
    imageUrl: skillIcon("python"),
  },
  {
    label: "Langchain",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShzp30XASXzPGrU2z1yjrI5WUriI-Iz2N1jw&s",
  },
  {
    label: "RAG",
    imageUrl: iconifyIcon("carbon:ibm-watson-discovery"),
  },
  {
    label: "MCP",
    imageUrl: simpleIcon("modelcontextprotocol"),
    imageClassName: "brightness-0 invert",
  },
  {
    label: "LlamaIndex",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLuujmhhDXEqz6kOG6ixAOj1HeWh25mSIz7CdYtPeOE4hKdlrewmTFsg4&s=10",
  },
  {
    label: "Google GCP",
    imageUrl: "https://avatars.githubusercontent.com/u/2810941?s=280&v=4",
  },
  {
    label: "Amazon SageMaker",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUlxECOa-gHFDfbmg_Ez0qfj4SrRq6CxltVMhlR4jeMvBIRB54itaVLGY&s=10",
  },
  {
    label: "Supabase",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTHpiCovcf59kKFAXDhHcHx-6anNAvDvUb9u5uqyE8Rg&s=10",
  },
];

export default stackItems;
