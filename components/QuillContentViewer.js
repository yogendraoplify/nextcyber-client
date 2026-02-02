import "quill/dist/quill.snow.css";

const QuillContentViewer = ({ html }) => {
  return (
    <span dangerouslySetInnerHTML={{ __html: html }}></span>
  );
};

export default QuillContentViewer;
