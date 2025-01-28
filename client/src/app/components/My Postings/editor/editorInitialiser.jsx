import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ListTool from "@editorjs/list";
// import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
// import LinkTool from "@editorjs/link";
import RawTool from "@editorjs/raw";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Marker from "@editorjs/marker";
import CodeTool from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";

export const initEditor = () => {
  const editor = new EditorJS({
    holder: "editorjs",
    autofocus: true,
    placeholder: "Start Writing Now...",
    onChange: async () => {
      let content = await editor.save();
      console.log(content);
    },
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
      // linkTool: {
      //   class: LinkTool,
      //   config: {
      //     // endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
      //   },
      // },
      inlineCode: {
        class: InlineCode,
        shortcut: "CMD+SHIFT+M",
      },
      raw: {
        class: RawTool,
        title: "Raw HTML", // Set the desired title
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 3,
          cols: 3,
        },
      },
      warning: {
        class: Warning,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+W",
        config: {
          titlePlaceholder: "Title",
          messagePlaceholder: "Message",
        },
      },
      // image: ImageTool,
      list: {
        class: ListTool,
        inlineToolbar: true,
      },
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      code: CodeTool,
      delimiter: Delimiter,
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+O",
        config: {
          quotePlaceholder: "Enter a quote",
          captionPlaceholder: "Quote's author",
        },
      },
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            coub: true,
          },
        },
      },
      Marker: {
        class: Marker,
        shortcut: "CMD+SHIFT+M",
        inlineToolbar: true,
      },
    },
  });

  return editor;
};
