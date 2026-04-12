export const modules = {
    toolbar: [
      [{ align: [] }, { align: "center" }, { align: "right" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      // [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      [{ direction: "rtl" }], // text direction
  
      [{ color: [] }, { background: [] }],
  
      ["clean"],
    ],
    // toolbar: [
    //   [{ header: [1, 2, false] }],
    //   ["bold", "italic", "underline", "strike", "blockquote"],
    //   [
    //     { list: "ordered" },
    //     // { list: "bullet" },
    //     // { indent: "-1" },
    //     { indent: "+1" },
    //   ],
    //   ["link", "image"],
    //   ["clean"],
    // ],
    clipboard: {
      matchVisual: false,
    },
  };
  
  export const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    // "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "color",
    "background",
    "direction",
    "code-block",
  ];