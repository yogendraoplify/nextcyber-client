import { enhanceResumeSection, generateResume } from "@/api/resumeApi";
import { set } from "react-hook-form";
import toast from "react-hot-toast";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

export const generateResumeAPIHandler =
  (payload, setError, setLoading, setResume, setSelectedSection) =>
  async (dispatch) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await generateResume(payload);
      if (!data || !data.success) {
        throw new Error((data && data.message) || "Failed to generate resume");
      }
      setResume(data.resume);
      // clear selection on new resume
      setSelectedSection(null);
    } catch (error) {
      console.log(error);
      setError(error?.message || "Failed to generate resume");
      // toast.error(getErrorMessage(error));
      toast.error("Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

export const enhanceResumeSectionAPIAPIHandler =
  (payload, setResume, setSelectedSection, scrollLeftTo, setLoading) =>
  async (dispatch) => {
    setLoading(true);

    try {
      const { data } = await enhanceResumeSection(payload);
      if (!data || !data.success) {
        throw new Error((data && data.message) || "Enhancement failed");
      }
      setResume(data.resume);
      setSelectedSection(payload.sectionKey);
      setTimeout(() => scrollLeftTo(payload.sectionKey), 120);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
