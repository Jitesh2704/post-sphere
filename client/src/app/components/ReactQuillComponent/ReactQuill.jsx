import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import { DragAndDropModule } from 'quill-drag-and-drop-module';
// import ImageResize from 'quill-image-resize-module-react';

// const dragAndDropModule = new DragAndDropModule();
// const quillModules = {
//   dragAndDrop: dragAndDropModule.getModule(),
// };

// ReactQuill.Quill.register('modules/dragAndDrop', quillModules.dragAndDrop);
// ReactQuill.Quill.register('modules/imageResize', ImageResize);

const CustomQuillEditor = ({
  data = "",
  onChange,
  uploadService,
  mode = "advanced",
  purpose,
  placeholder,
}) => {
  const [editorData, setEditorData] = useState("");

  const editorRef = useRef(null);

  console.log(data);
  useEffect(() => {
    setEditorData(data || "");
  }, [data]);

  // const handleEditorChange = (content) => {
  //   setEditorData(content);
  //   onChange(content);
  // };

  const handleEditorChange =
    // useMemo(
    (content, delta, source, editor) => {
      // console.log("content:",content)
      // console.log("delta:",delta)
      // console.log("source:",source)
      // console.log("editor:",editor)
      // if (source === 'user') {
      setEditorData(content);
      onChange(content);
      // }
    };
  //   ,[onChange]
  // )

  // const imageHandler = async () => {
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.setAttribute('accept', 'image/*');
  //   input.click();

  //   input.onchange = async () => {
  //     const file = input.files[0];
  //     const formData = new FormData();
  //     formData.append('image', file);
  //     if(purpose){
  //       formData.append('purpose', purpose);
  //     }

  //     const response = await uploadService(formData);
  //     console.log(response)
  //     // const url = response.data.imageUrl;
  //     const imageName = response.data.storageName

  //     const url = `${import.meta.env.VITE_REACT_APP_HOST}multimedia/images/${imageName}`

  //     const editor = editorRef.current.getEditor();
  //     const cursorPosition = editor.getSelection()?.index || 0;

  //     editor.insertEmbed(cursorPosition, 'image', url);
  //   };
  // };

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) {
        return; // Early return if no file is selected
      }

      const formData = new FormData();
      formData.append("image", file);
      if (purpose) {
        formData.append("purpose", purpose);
      }

      try {
        // Destructure to directly access the `request` property from the returned object
        const { request } = uploadService(formData, (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${progress}%`);
        });

        // Await the Axios request directly
        const response = await request;

        // Now you have access to the actual response data
        console.log(response.data); // Assuming this logs the expected response object from your server

        const imageServerUrl = import.meta.env.VITE_REACT_APP_HOST;
        // Adjust the following line according to how your server responds
        const imageUrl = `${imageServerUrl}multimedia/images/${response.data.image.storageName}`;

        const editor = editorRef.current.getEditor();
        const cursorPosition = editor.getSelection()?.index || 0;
        editor.insertEmbed(cursorPosition, "image", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle the error appropriately (e.g., display a message to the user)
      }
    };
  };

  const getToolbarOptions = useCallback(() => {
    switch (mode) {
      case "basic":
        return [
          ["bold", "italic", "underline"],
          [{ size: ["small", false, "large", "huge"] }],
        ];
      case "advanced":
        return [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          ["link", "image", "video"],
          ["clean"],
        ];
      case "multimedia":
        return [
          ["bold", "italic", "underline"],
          ["link", "image", "video"],
        ];
      case "text-based":
        return [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          // [{ 'direction': 'rtl' }],
          // [{ 'size': ['small', false, 'large', 'huge'] }],
          ["link"],
          ["clean"],
        ];
      default:
        return [];
    }
  }, [mode]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: getToolbarOptions(),
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
      // imageResize: {
      //     parchment: ReactQuill.Quill.import('parchment'),
      //     modules: ['Resize', 'DisplaySize']
      // },
      // dragAndDrop: true
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "script",
    "sub",
    "super",
    "indent",
    "direction",
    "size",
    "link",
    "image",
    "video",
  ];

  return (
    <ReactQuill
      ref={editorRef}
      value={editorData}
      onChange={handleEditorChange}
      modules={modules}
      formats={formats}
      bounds={".custom-editor"}
      placeholder={placeholder ? placeholder : "Enter text here..."}
      className="text-black"
    />
  );
};

// export default CustomQuillEditor;
export { CustomQuillEditor };
