"use client";
import DocumentUploader from "@/components/aIResumeBuillder/DocumentUploader";
import ResumeBuilder from "@/components/aIResumeBuillder/ResumeBuilder";
import ResumeBuilderPrev from "@/components/aIResumeBuillder/ResumeBuilderPrev";
import { toggleSidebar } from "@/store/slices/appSettingsSlice";
import {
  ArrowLeft,
  ArrowRight,
  CircleX,
  File,
  Plus,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";

const MyNextgenCV = () => {
  const dispatch = useDispatch();
  /* First Screen */
  const [modal, setModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [promptError, setPromptError] = useState("");
  const [inputFileTabActive, setInputFileTabActive] = useState(false);
  const [inputPromptTabActive, setInputPromptTabActive] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const generateResumeHandler = () => {
    if (inputPromptTabActive) {
      if (prompt.trim().split(" ").length < 10) {
        setPromptError("Prompt must be at least 10 words long.");
        return;
      }
    }
    setShowResumeBuilder(true);
    setPromptError("");
    dispatch(toggleSidebar());
  };

  const resetAll = () => {
    setModal(false);
    setPromptError(false);
    setInputFileTabActive(false);
    setInputPromptTabActive(false);
    setResume(null);
    setPrompt("");
  };

  return (
    <>
      {showResumeBuilder ? (
        // old one but working -
        // <ResumeBuilderPrev
        //   promptInput={prompt}
        //   setPromptInput={setPrompt}
        //   resumeInput={resume}
        //   setResumeInput={setResume}
        //   setShowResumeBuilder={setShowResumeBuilder}
        //   resetAll={resetAll}
        // />
        <ResumeBuilder
          promptInput={prompt}
          setPromptInput={setPrompt}
          resumeInput={resume}
          setResumeInput={setResume}
          setShowResumeBuilder={setShowResumeBuilder}
          resetAll={resetAll}
        />
      ) : (
        <>
          <section>
            {/* First Screen */}
            <div className="w-full max-w-[1250px] mx-auto py-20 flex flex-col items-center gap-6">
              <Image
                src={"./resume/resume-frame.svg"}
                height={280}
                width={460}
                alt="resume-frame"
              />
              <div className="flex flex-col items-center">
                <h2 className="text-accent-color-1 leading-8 text-2xl font-medium">
                  No Resume Yet
                </h2>
                <p className="mt-3 mb-5 text-g-200 text-sm leading-5">
                  Get started on crafting your first resume to kickstart your
                  career journey.
                </p>
                <button
                  className="flex cursor-pointer items-center gap-2 rounded-lg border-g-500 border bg-primary px-4 py-2 text-white leading-5 text-sm font-medium hover:bg-primary/90 transition-colors"
                  onClick={() => setModal(true)}
                >
                  <Plus size={20} />
                  <span>Create NextGen CV</span>
                </button>
              </div>
            </div>
          </section>
          {/* Modal */}

          {modal && (
            <section className="fixed top-0 left-0 w-full h-screen z-[100000] bg-[#43434599] flex items-center justify-center">
              <div
                className="w-[550px] min-h-[328px] border rounded-lg bg-g-600 border-g-400 shrink-0 flex flex-col"
                style={{ boxShadow: "0px 0px 40px 12px #1B1C1E38" }}
              >
                <div className="w-full py-5 px-10 flex items-start justify-between border-b border-b-g-400">
                  <div>
                    <h2 className="text-white leading-7 font-semibold text-xl">
                      Create your NextGen CV
                    </h2>
                    <p className="text-g-200 text-sm leading-5">
                      Go with the option that fits best for you
                    </p>
                  </div>
                  <button
                    onClick={resetAll}
                    className="text-g-200 cursor-pointer hover:text-g-200/90 transition-colors"
                  >
                    <CircleX size={20} />
                  </button>
                </div>
                {!inputFileTabActive && !inputPromptTabActive && (
                  <div className="w-full p-10 flex flex-col gap-4">
                    <button
                      className="w-full py-3 px-5 rounded-lg border border-g-400 bg-g-500 cursor-pointer hover:bg-g-500/90 transition-colors flex items-center gap-4"
                      onClick={() => setInputFileTabActive(true)}
                    >
                      <div className="w-[44px] h-[44px] rounded-[4px] bg-light-blue p-3 text-primary">
                        <File size={20} />
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <h3 className="text-base leading-6 font-medium">
                          Upload your Resume
                        </h3>
                        <p className="text-g-200 leading-5 text-sm">
                          Pick a resume from your device
                        </p>
                      </div>
                    </button>
                    <button
                      className="w-full py-3 px-5 rounded-lg border border-g-400 bg-g-500 cursor-pointer hover:bg-g-500/90 transition-colors flex items-center gap-4"
                      onClick={() => setInputPromptTabActive(true)}
                    >
                      <div className="w-[44px] h-[44px] rounded-[4px] bg-light-blue p-3 text-primary">
                        <Sparkles size={20} />
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <h3 className="text-base leading-6 font-medium">
                          Start with AI Prompt
                        </h3>
                        <p className="text-g-200 leading-5 text-sm">
                          Give a prompt to AI for your resume
                        </p>
                      </div>
                    </button>
                  </div>
                )}

                {(inputFileTabActive || inputPromptTabActive) && (
                  <div className="w-full flex-1 p-10 flex flex-col gap-6 justify-between">
                    {inputFileTabActive && (
                      <DocumentUploader
                        required
                        value={resume}
                        error={false}
                        onChange={(file) => {
                          setResume(file);
                        }}
                        onRemove={() => {
                          setResume(null);
                        }}
                      />
                    )}

                    {inputPromptTabActive && (
                      <div>
                        <textarea
                          className="w-full h-[144px] bg-g-700 border border-g-500 outline-none py-4 px-5 rounded-lg text-sm leading-5 resize-none text-g-300 placeholder:text-g-300 hide-scrollbar"
                          value={prompt}
                          onChange={(e) => {
                            if (e.target.value.trim().split(" ").length >= 10) {
                              setPromptError("");
                            }
                            setPrompt(e.target.value);
                          }}
                          placeholder="Provide instructions to create your resume..."
                        ></textarea>
                        {promptError && (
                          <span className="text-xs leading-4 text-red-500">
                            {promptError}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="w-full flex items-center justify-between">
                      <button
                        className="flex gap-2 items-center text-g-200 border-g-500 border px-6 py-3 rounded-lg cursor-pointer hover:bg-g-400 transition-colors"
                        onClick={() => {
                          setInputFileTabActive(false);
                          setInputPromptTabActive(false);
                          setResume(null);
                          setPrompt("");
                        }}
                      >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                      </button>

                      <button
                        className={`flex gap-2 items-center text-white px-6 py-3 bg-primary rounded-lg ${
                          !(resume || prompt)
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer hover:bg-primary/90 transition-colors opacity-100"
                        }`}
                        onClick={generateResumeHandler}
                        disabled={!(resume || prompt)}
                      >
                        <Sparkles size={20} />
                        <span>Generate NextGen CV</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default MyNextgenCV;
