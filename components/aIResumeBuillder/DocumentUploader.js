import { useDropzone } from "react-dropzone";
import { IoCloseCircle } from "react-icons/io5";
import { CircleX, File, FileText, ImageUp } from "lucide-react";

export default function DocumentUploader({
  label = "Upload Document",
  required = false,
  value, // File object
  error,
  onChange,
  onRemove,
}) {
  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      onChange(null);
      return;
    }

    if (acceptedFiles.length > 0) {
      onChange(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    onDrop,
    multiple: false,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // ✅ 10MB
  });

  return (
    <div className="flex flex-col">
      {/* <label className="text-sm leading-5 font-medium text-grey-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label> */}

      {/* Upload Box */}
      {!value ? (
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />

          <div
            className={`border-2 border-dashed ${
              error ? "border-red-500" : "border-g-600"
            } rounded-lg h-[184px] text-center flex flex-col justify-center items-center bg-g-500`}
            style={{ dashes: "4, 4" }}
          >
            <ImageUp size={20} className="text-accent-color-1" />
            <p className="text-xs leading-4 mt-3 text-g-200 text-center">
              <span className="text-accent-color-1 text-xs leading-4 text-center">
                Upload a file
              </span>{" "}
              or drag and drop
              <br />
              .pdf and .docx up to 5MB.
            </p>
          </div>
        </div>
      ) : (
        /* File Name Display */
        <div className="h-[184px] w-full flex items-start">
          <div className="w-full py-3 px-5 rounded-lg border border-g-400 bg-g-500 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-[44px] h-[44px] rounded-[4px] bg-light-blue p-3 text-primary">
                <File size={20} />
              </div>
              <div className="flex flex-col gap-1 items-start">
                <h3 className="text-base leading-6 font-medium">New Resume</h3>
                <p className="text-g-200 leading-5 text-sm">{value.name}</p>
              </div>
            </div>

            <button
              onClick={onRemove}
              className="text-g-200 cursor-pointer hover:text-g-200/90 transition-colors"
            >
              <CircleX size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
