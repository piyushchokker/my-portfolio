import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BrainCircuit,
  Github,
  Sparkles,
} from "lucide-react";
import Loading from "../Components/Loading";
import NavBar from "../Components/NavBar";
import Piyush from "../assets/img/Piyush.png";

import College from "../assets/img/College.png";
import SundropBrands from "../assets/img/SundropBrands.jpg";
import OfferLetterAskOllie from "../assets/img/offerletter_askollie.jpeg";
import KrmuFront from "../assets/img/krmu_front.jpeg";

const storyBeats = [
  {
    kicker: "Building the Foundation",
    title: "Bachelor of Computer Applications (AI & Data Science)",
    body: "Enrolled in BCA with a specialization in AI and Data Science. I built a strong foundation in Machine Learning, Mathematics, and Artificial Neural Networks. This is where I first understood how biological neurons inspire computational models.",
    image: College,
    imageAlt: "Building the Foundation",
  },
  {
    kicker: "Industry Experience",
    title: "Applying Technology at Sundrop Brands",
    body: "As an MIS Automation Engineer Intern, I engineered reporting automation using Python and advanced Excel, reducing manual processing time by over 70%. I learned that while automation saves time, intelligence creates value.",
    image: SundropBrands,
    imageAlt: "Sundrop Brands Experience",
  },
  {
    kicker: "Advanced Studies",
    title: "Master's in AI & Machine Learning",
    body: "Pursued an MCA specializing in AI & ML to dive deeper into Deep Learning, LLMs, RAG, Agentic AI Systems, and Production AI Deployment. I built multiple AI applications that strengthened my engineering skills.",
    image: KrmuFront,
    imageAlt: "Master's Degree at KRMU",
  },
  {
    kicker: "Real-world Scale",
    title: "Building AskOllie — A Production RAG System",
    body: "Developed an AI-powered university assistant serving ~9,000 monthly users. Working on AskOllie taught me production AI engineering, document ingestion pipelines, vector databases, and the practical challenges of deploying reliable AI.",
    image: OfferLetterAskOllie,
    imageAlt: "AskOllie Offer Letter",
  }
];

const tools = [
  "Python",
  "FastAPI",
  "LangChain",
  "LangGraph",
  "PostgreSQL",
  "RAG",
  "LLMs",
  "Computer Vision",
];

function StoryVisual({ beat, index }) {
  if (beat.image) {
    return (
      <div
        className={`group overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30 ${index === storyBeats.length - 1 ? "max-h-[360px]" : ""}`}
      >
        <img
          src={beat.image}
          alt={beat.imageAlt}
          loading={index === 0 ? "eager" : "lazy"}
          className={`h-full min-h-[230px] w-full object-cover transition duration-500 ease-out group-hover:scale-105 ${beat.image === Piyush ? "object-[center_22%]" : ""}`}
        />
      </div>
    );
  }

  const Icon = beat.Icon;

  return (
    <div className="relative grid min-h-[230px] place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50" />
      <div className="relative grid h-24 w-24 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-emerald-200 shadow-2xl shadow-black/30">
        <Icon size={36} strokeWidth={1.7} />
      </div>
    </div>
  );
}

function StoryBeat({ beat, index }) {
  const visualFirst = index % 2 === 1;

  return (
    <section className="grid gap-7 border-b border-white/10 px-5 py-12 sm:px-7 md:grid-cols-[0.95fr_1.05fr] md:items-center">
      <div className={`${visualFirst ? "md:order-2" : ""}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600">
          {beat.kicker}
        </p>
        <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
          {beat.title}
        </h2>
        <p className="mt-5 font-mono text-sm leading-7 text-zinc-400">
          {beat.body}
        </p>
      </div>
      <StoryVisual beat={beat} index={index} />
    </section>
  );
}

function AboutPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100 selection:bg-white selection:text-zinc-950">
      <main className="relative isolate min-h-screen overflow-hidden bg-[#070707] px-3 pb-28 pt-5 sm:px-6 sm:pb-32 sm:pt-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="pointer-events-none absolute inset-x-0 top-[45%] h-10 border-y border-white/10 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.12)_0,rgba(255,255,255,0.12)_1px,transparent_1px,transparent_7px)] opacity-30" />

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative mx-auto w-full max-w-[768px] border-x border-white/10 bg-[#070707]/88 shadow-2xl shadow-black/40 backdrop-blur"
        >
          <header className="flex h-14 items-center justify-between gap-2 border-y border-white/10 px-3">
            <a
              href="/"
              className="inline-flex h-8 items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3 font-mono text-xs text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:text-white"
            >
              <ArrowLeft size={14} />
              home
            </a>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/piyushchokker"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-8 w-8 place-items-center rounded-md border border-white/15 bg-white/[0.04] text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:text-white"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
              <span className="rounded-md border border-white/10 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                about
              </span>
            </div>
          </header>

          <section className="border-b border-white/10 px-5 py-12 sm:px-7 sm:py-14">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-emerald-300">
              <Sparkles size={14} />
              about me
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.22)] sm:text-5xl">
              I build practical AI applications that solve real-world problems.
            </h1>
          </section>

          <section className="grid border-b border-white/10 sm:grid-cols-[176px_1fr]">
            <div className="relative flex items-center justify-center border-b border-white/10 p-4 sm:border-b-0 sm:border-r">
              <div className="-mt-10 h-36 w-36 overflow-hidden rounded-full border-4 border-[#070707] shadow-[0_0_0_1px_rgba(255,255,255,0.18)] sm:-mt-12">
                <img
                  src={Piyush}
                  alt="Piyush Chokker"
                  className="h-full w-full scale-[1.2] object-cover object-[center_22%] transition duration-500 ease-out hover:scale-[1.25]"
                />
              </div>
            </div>
            <div className="grid content-center px-5 pb-24 pt-6 sm:py-6">
              <p className="text-base font-bold text-white">
                Hi, I am Piyush.
              </p>
              <p className="mt-3 font-mono text-sm leading-7 text-zinc-400">
                Ever since I was a child watching JARVIS, I've been fascinated by intelligent systems. Today, as an AI Engineer from India, I enjoy taking ideas from concept to deployment by combining software engineering with modern AI technologies like Agentic AI, LLMs, and Computer Vision.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-xs text-zinc-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="border-b border-white/10">
            <header className="stack-header-line relative flex h-[60px] items-center overflow-hidden border-b border-white/10 px-4">
              <h2 className="relative z-10 text-[30px] font-bold tracking-[-0.04em] text-white sm:text-[32px]">
                Here is the story...
              </h2>
            </header>
          </section>

          {storyBeats.map((beat, index) => (
            <StoryBeat key={beat.kicker} beat={beat} index={index} />
          ))}

          <section className="px-5 py-12 sm:px-7">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600">
                looking ahead
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-white">
                To build AI that genuinely helps people.
              </h2>
              <p className="mt-5 font-mono text-sm leading-7 text-zinc-400">
                From being inspired by a fictional AI assistant to engineering real-world intelligent systems, my journey has always been driven by one goal. Every project I undertake brings me one step closer to that childhood dream of creating intelligent systems that can understand, reason, and make human life easier.
              </p>
            </div>
          </section>
        </motion.section>
      </main>
      <NavBar />
    </div>
  );
}

export default AboutPage;
