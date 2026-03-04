"use client";
import { useState, useRef } from "react";
import {
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
  MapPin,
  Briefcase,
  Building2,
  ChevronRight,
  Zap,
  BookOpen,
  Trophy,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Star,
  DollarSign,
  ArrowUpRight,
  Share2,
  Calendar,
} from "lucide-react";
import axios from "@/utils/axios";
import { currencyFormatter, timeFormatter } from "@/helper";
import { BiDollarCircle } from "react-icons/bi";

const EXAMPLE_PROMPTS = [
  {
    title: "Tech Transition",
    description:
      "I want to transition from a marketing background into a UX design role at a tech startup within 18 months.",
  },
  {
    title: "Engineering Growth",
    description:
      "I'm a junior frontend developer and I want to become a full-stack engineer specializing in AI-powered products.",
  },
  {
    title: "Leadership Path",
    description:
      "I have 3 years of software engineering experience and want to move into a tech lead or engineering manager role.",
  },
];

const DIFFICULTY_STYLES = {
  Beginner: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
  Intermediate: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  Advanced: {
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/30",
  },
};

function TrainingPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const outputRef = useRef(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await axios.post("/student/get-career-path", {
        prompt: prompt.trim(),
      });
      setData(res.data.data);
      setTimeout(
        () => outputRef.current?.scrollIntoView({ behavior: "smooth" }),
        150,
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setPrompt("");
  };

  const { careerPath, relatedJobs, overallAdvice } = data || {};
  const diffStyle =
    DIFFICULTY_STYLES[careerPath?.difficulty] || DIFFICULTY_STYLES.Intermediate;

  return (
    <section className="relative">
      <div className="w-full max-w-[1250px] mx-auto pt-5 pb-20 flex flex-col items-center gap-16">
        {/* ─── Hero / Input ─── */}
        <div className="w-full flex flex-col items-center gap-10">
          {/* Heading */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full">
              <Sparkles size={13} className="text-primary" />
              <span className="text-primary text-xs font-medium tracking-wide">
                Powered by NextGen AI
              </span>
            </div>
            <h2 className="text-accent-color-1 leading-tight text-3xl font-bold max-w-xl">
              Create your personalized career path journey
            </h2>
            <p className="text-g-300 text-sm max-w-lg leading-6">
              Tell us your career goal and we'll build a step-by-step roadmap
              tailored to your profile — with real job opportunities at every
              stage.
            </p>
          </div>

          {/* Example Prompt Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-10">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex.title}
                onClick={() => setPrompt(ex.description)}
                className="bg-g-700 border border-g-500 hover:border-primary/50 hover:bg-g-600 transition-all duration-200 py-4 px-5 rounded-xl text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={13} className="text-primary" />
                  <span className="text-white text-sm font-semibold">
                    {ex.title}
                  </span>
                </div>
                <p className="text-g-300 text-sm leading-5 group-hover:text-g-200 transition-colors">
                  {ex.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Use this prompt</span>
                  <ChevronRight size={11} />
                </div>
              </button>
            ))}
          </div>

          {/* Textarea + Actions + Button */}
          <div className="w-full flex flex-col gap-3 px-10">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
                  handleGenerate();
              }}
              className="w-full h-[110px] bg-g-700 border border-g-500 focus:border-primary/60 outline-none py-4 px-5 rounded-xl text-sm leading-6 resize-none text-white placeholder:text-g-400 transition-colors"
              placeholder="e.g. I want to become a full-stack engineer specializing in AI-powered products within 2 years..."
            />
            <div className="flex items-center justify-between">
              <p className="text-g-500 text-xs">
                Tip: Press Ctrl + Enter to generate
              </p>
              <div className="flex items-center gap-3">
                {data && (
                  <button
                    onClick={handleReset}
                    className="flex gap-2 items-center text-g-300 hover:text-white px-5 py-2.5 border border-g-500 hover:border-g-400 rounded-lg transition-colors text-sm cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  className={`flex gap-2 items-center text-white px-6 py-2.5 bg-primary rounded-lg text-sm font-medium transition-all ${
                    !prompt.trim() || loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary/90 cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-4 py-3 rounded-lg">
                <AlertCircle size={15} className="text-rose-400 shrink-0" />
                <p className="text-rose-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Output ─── */}
        {data && (
          <div ref={outputRef} className="w-full flex flex-col gap-10 px-10">
            {/* Career Path Header Card */}
            <div className="bg-g-700 border border-g-500 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-2xl font-bold">
                    {careerPath.title}
                  </h3>
                  <div className="flex items-center gap-2 text-g-300 text-sm">
                    <Target size={13} className="text-primary" />
                    <span>
                      Target Role:{" "}
                      <span className="text-white font-medium">
                        {careerPath.targetRole}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${diffStyle.bg} ${diffStyle.border} ${diffStyle.color}`}
                  >
                    <Star size={11} />
                    {careerPath.difficulty}
                  </div>
                  <div className="flex items-center gap-1.5 bg-g-600 border border-g-500 px-3 py-1 rounded-full text-xs text-g-200">
                    <Clock size={11} />
                    {careerPath.estimatedDuration}
                  </div>
                </div>
              </div>

              <p className="text-g-300 text-sm leading-6">
                {careerPath.summary}
              </p>

              {overallAdvice && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex gap-3">
                  <Sparkles
                    size={15}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <p className="text-g-200 text-sm leading-6 italic">
                    {overallAdvice}
                  </p>
                </div>
              )}
            </div>

            {/* Roadmap Timeline */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white text-xl font-semibold flex items-center gap-2">
                <TrendingUp size={19} className="text-primary" />
                Your Roadmap
              </h3>
              <div className="flex flex-col">
                {careerPath.steps.map((step, idx) => (
                  <div key={step.stepNumber} className="relative flex gap-5">
                    {/* Connector */}
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shrink-0 z-10">
                        <span className="text-primary text-sm font-bold">
                          {step.stepNumber}
                        </span>
                      </div>
                      {idx < careerPath.steps.length - 1 && (
                        <div className="w-px flex-1 bg-g-500 my-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`flex flex-col gap-3 ${
                        idx < careerPath.steps.length - 1 ? "pb-8" : "pb-0"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-wrap pt-1.5">
                        <h4 className="text-white font-semibold text-base">
                          {step.title}
                        </h4>
                        <span className="flex items-center gap-1 text-xs text-g-300 bg-g-700 border border-g-500 px-2.5 py-0.5 rounded-full">
                          <Clock size={10} />
                          {step.duration}
                        </span>
                      </div>

                      <p className="text-g-300 text-sm leading-6">
                        {step.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {step.skillsToAcquire?.length > 0 && (
                          <div className="bg-g-700 border border-g-500 rounded-lg p-3">
                            <p className="text-xs text-g-400 font-medium mb-2 flex items-center gap-1.5">
                              <BookOpen size={11} />
                              Skills to Learn
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {step.skillsToAcquire.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {step.milestones?.length > 0 && (
                          <div className="bg-g-700 border border-g-500 rounded-lg p-3">
                            <p className="text-xs text-g-400 font-medium mb-2 flex items-center gap-1.5">
                              <Trophy size={11} />
                              Milestones
                            </p>
                            <ul className="flex flex-col gap-1.5">
                              {step.milestones.map((m) => (
                                <li
                                  key={m}
                                  className="flex items-start gap-1.5 text-xs text-g-300"
                                >
                                  <CheckCircle2
                                    size={11}
                                    className="text-emerald-400 mt-0.5 shrink-0"
                                  />
                                  {m}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {step.actionItems?.length > 0 && (
                          <div className="bg-g-700 border border-g-500 rounded-lg p-3">
                            <p className="text-xs text-g-400 font-medium mb-2 flex items-center gap-1.5">
                              <ArrowRight size={11} />
                              Action Items
                            </p>
                            <ul className="flex flex-col gap-1.5">
                              {step.actionItems.map((a) => (
                                <li
                                  key={a}
                                  className="flex items-start gap-1.5 text-xs text-g-300"
                                >
                                  <ChevronRight
                                    size={11}
                                    className="text-primary mt-0.5 shrink-0"
                                  />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-g-700 border border-g-500 rounded-xl p-5 flex flex-col gap-3">
                <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Trophy size={15} className="text-emerald-400" />
                  Your Current Strengths
                </h4>
                <ul className="flex flex-col gap-2">
                  {careerPath.currentStrengths?.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2 text-sm text-g-300"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-emerald-400 shrink-0 mt-0.5"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-g-700 border border-g-500 rounded-xl p-5 flex flex-col gap-3">
                <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                  <AlertCircle size={15} className="text-amber-400" />
                  Skill Gaps to Address
                </h4>
                <ul className="flex flex-col gap-2">
                  {careerPath.skillGaps?.map((g) => (
                    <li
                      key={g}
                      className="flex items-start gap-2 text-sm text-g-300"
                    >
                      <ChevronRight
                        size={14}
                        className="text-amber-400 shrink-0 mt-0.5"
                      />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Salary Progression */}
            {careerPath.salaryProgression && (
              <div className="flex flex-col gap-4">
                <h3 className="text-white text-xl font-semibold flex items-center gap-2">
                  <DollarSign size={19} className="text-primary" />
                  Salary Progression
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Entry Level",
                      value: careerPath.salaryProgression.entry,
                      accent: "text-emerald-400",
                      bar: "bg-emerald-400",
                      width: "w-1/3",
                    },
                    {
                      label: "Mid Level",
                      value: careerPath.salaryProgression.mid,
                      accent: "text-amber-400",
                      bar: "bg-amber-400",
                      width: "w-2/3",
                    },
                    {
                      label: "Senior Level",
                      value: careerPath.salaryProgression.senior,
                      accent: "text-primary",
                      bar: "bg-primary",
                      width: "w-full",
                    },
                  ].map(({ label, value, accent, bar, width }) => (
                    <div
                      key={label}
                      className="bg-g-700 border border-g-500 rounded-xl p-4 flex flex-col gap-3"
                    >
                      <p className="text-g-400 text-xs">{label}</p>
                      <p className={`font-bold text-lg ${accent}`}>{value}</p>
                      <div className="h-1 bg-g-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar} ${width} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternative Paths */}
            {careerPath.alternativePaths?.length > 0 && (
              <div className="bg-g-700 border border-g-500 rounded-xl p-5 flex flex-col gap-3">
                <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Zap size={15} className="text-primary" />
                  Alternative Paths to Explore
                </h4>
                <div className="flex flex-wrap gap-2">
                  {careerPath.alternativePaths.map((p) => (
                    <span
                      key={p}
                      className="text-sm text-g-200 bg-g-600 border border-g-500 px-3 py-1.5 rounded-full"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Jobs */}
            {relatedJobs?.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-xl font-semibold flex items-center gap-2">
                    <Briefcase size={19} className="text-primary" />
                    Related Job Opportunities
                  </h3>
                  <span className="text-g-400 text-sm">
                    {relatedJobs.length} jobs matched
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedJobs.map(
                    ({ job, relevanceScore, careerStage, relevanceReason }) =>
                      job && (
                        // <div
                        //   key={job.id}
                        //   className="bg-g-700 border border-g-500 hover:border-primary/40 rounded-xl p-5 flex flex-col gap-3 transition-colors group cursor-pointer"
                        // >
                        //   {/* Title + Score */}
                        //   <div className="flex items-start justify-between gap-2">
                        //     <div className="flex flex-col gap-1 min-w-0">
                        //       <h4 className="text-white font-semibold text-sm leading-5 line-clamp-2 group-hover:text-primary transition-colors">
                        //         {job.title}
                        //       </h4>
                        //       <div className="flex items-center gap-1.5 text-g-400 text-xs">
                        //         <Building2 size={11} />
                        //         <span className="truncate">
                        //           {job.company || "Company"}
                        //         </span>
                        //       </div>
                        //     </div>
                        //     <div className="flex flex-col items-center shrink-0 bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5">
                        //       <span className="text-primary font-bold text-sm leading-none">
                        //         {relevanceScore}
                        //       </span>
                        //       <span className="text-primary/60 text-[10px] mt-0.5">
                        //         match
                        //       </span>
                        //     </div>
                        //   </div>

                        //   {/* Tags */}
                        //   <div className="flex flex-wrap gap-1.5">
                        //     {job.location && (
                        //       <span className="flex items-center gap-1 text-xs text-g-300 bg-g-600 px-2 py-0.5 rounded-full">
                        //         <MapPin size={9} />
                        //         {job.location}
                        //       </span>
                        //     )}
                        //     {job.remotePolicy && (
                        //       <span className="text-xs text-g-300 bg-g-600 px-2 py-0.5 rounded-full">
                        //         {job.remotePolicy}
                        //       </span>
                        //     )}
                        //     {job.contractType && (
                        //       <span className="text-xs text-g-300 bg-g-600 px-2 py-0.5 rounded-full">
                        //         {job.contractType}
                        //       </span>
                        //     )}
                        //   </div>

                        //   {/* Career Stage */}
                        //   {careerStage && (
                        //     <div className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 border border-primary/15 px-2.5 py-1 rounded-md">
                        //       <Target size={10} />
                        //       {careerStage}
                        //     </div>
                        //   )}

                        //   {/* Reason */}
                        //   <p className="text-g-400 text-xs leading-4 line-clamp-2">
                        //     {relevanceReason}
                        //   </p>

                        //   {/* Salary */}
                        //   {job.salary && (
                        //     <p className="text-emerald-400 text-xs font-medium">
                        //       {job.salary}
                        //     </p>
                        //   )}

                        //   {/* Skills */}
                        //   {job.skills?.length > 0 && (
                        //     <div className="flex flex-wrap gap-1">
                        //       {job.skills.slice(0, 4).map((skill) => (
                        //         <span
                        //           key={skill}
                        //           className="text-[11px] text-g-300 bg-g-600 border border-g-500 px-2 py-0.5 rounded-full"
                        //         >
                        //           {skill}
                        //         </span>
                        //       ))}
                        //       {job.skills.length > 4 && (
                        //         <span className="text-[11px] text-g-400 px-1 self-center">
                        //           +{job.skills.length - 4}
                        //         </span>
                        //       )}
                        //     </div>
                        //   )}
                        // </div>
                        <div
                          key={job.id}
                          className=" flex flex-col justify-between bg-g-700 rounded-[10px] overflow-hidden shadow-2xl p-5 border border-g-500 hover:border-primary transition-colors h-full"
                        >
                          <div>
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex gap-4">
                                <div className="w-15 h-15 bg-gray-300 rounded-2xl border-2 border-dark-yellow flex-shrink-0"></div>

                                <div>
                                  <h2 className="text-white text-md font-bold mb-1 truncate">
                                    {job?.company || "Unknown Company"}
                                  </h2>
                                  <p className="text-gray-400 text-xs truncate">
                                    Posted on {timeFormatter(job?.createdAt)}
                                  </p>
                                </div>
                              </div>
                              {/* <div className="flex gap-2.5">
                                <button
                                  className="bg-g-400 hover:bg-g-500 p-2 rounded-lg transition-colors cursor-pointer"
                                  onClick={() => handleItemClick(item)}
                                >
                                  <Sparkles size={20} className="text-g-100" />
                                </button>

                                <button className="bg-g-400 hover:bg-g-500 p-2 rounded-lg transition-colors">
                                  <Bookmark className="w-5 h-5 text-gray-400" />
                                </button>
                              </div> */}
                            </div>

                            <div className="mb-6">
                              <h1 className="text-white text-md font-bold mb-2">
                                {job?.title || "Job Title Here"}
                              </h1>
                              <p className="text-gray-400 text-xs">
                                {job?.location || "Location not specified"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-3">
                              <div className="flex items-center gap-1.5 text-g-100 bg-g-500 px-3 py-1 rounded text-xs">
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-300 text-xs font-medium">
                                  {job.contractType}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-g-100 bg-g-500 px-3 py-1 rounded text-xs">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-300 text-xs font-medium truncate">
                                  {job?.minWorkExperience}-
                                  {job?.maxWorkExperience} Years
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-g-100 bg-g-500 px-3 py-1 rounded text-xs">
                                <BiDollarCircle className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-300 text-xs font-medium">
                                  {currencyFormatter(job?.maxSalary) ??
                                    "Not disclosed"}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6 text-primary">
                              <div
                                className="flex items-center gap-[6px] bg-gradient-to-r px-3 py-1 rounded"
                                style={{ background: "#CFFFC8" }}
                              >
                                <Star className="w-5 h-5" />
                                <span className="text-xs font-semibold">
                                  Featured
                                </span>
                              </div>
                              <div className="flex items-center gap-[6px] bg-gradient-to-r px-3 py-1 rounded bg-[#E8DFFF]">
                                <Zap className="w-5 h-5 text-primary fill-primary" />
                                <span className="text-primary text-xs font-semibold">
                                  Urgent
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              className="flex-1 bg-primary text-white font-medium py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer truncate"
                              // onClick={() => {
                              //   // handleItemClick(item);
                              //   setJobActive(true);
                              //   setJobActiveData(item.job);
                              //   setShowMore(false);
                              // }}
                            >
                              <span>Apply Now</span>
                              <ArrowUpRight className="w-5 h-5" />
                            </button>
                            <button className="bg-primary text-white p-3.5 rounded-lg transition-colors cursor-pointer">
                              <Share2 className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default TrainingPage;
