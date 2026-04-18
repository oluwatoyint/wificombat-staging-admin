import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';
import dynamic from 'next/dynamic'

const QuillEditor = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-stone-100/80 animate-pulse rounded-md" />
  ),
});
