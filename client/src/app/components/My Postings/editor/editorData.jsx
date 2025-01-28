import userImage from "../../../assets/manImage.png";
import postImage from "../../../assets/postImage.png";

export const editorData = {
  time: 1703692630041,
  title: "A Beginner's Guide to Yoga Mastery",
  userImg: userImage,
  postImg: postImage,
  userName: "Deepanshu",
  date: "2023-12-20",
  publishDate: "Dec 20",
  commentCount: 2,
  likes: 15,
  blocks: [
    {
      id: "mhTl6ghSkV",
      type: "paragraph",
      data: {
        text: "Hey. Meet the new Editor. On this picture you can see it in action. Then, try a demo 🤓",
      },
    },
    {
      id: "l98dyx3yjb",
      type: "header",
      data: {
        text: "Key features",
        level: 3,
      },
    },
    {
      id: "os_YI4eub4",
      type: "list",
      data: {
        type: "unordered",
        items: [
          "It is a block-style editor",
          "It returns clean data output in JSON",
          "Designed to be extendable and pluggable with a <a href='https://editorjs.io/creating-a-block-tool'>simple API</a>",
        ],
      },
    },
    {
      id: "1yKeXKxN7-",
      type: "header",
      data: {
        text: "What does it mean «block-styled editor»",
        level: 3,
      },
    },
    {
      id: "TcUNySG15P",
      type: "paragraph",
      data: {
        text: "Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc. Each of them is an independent <sup data-tune='footnotes'>1</sup> contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.",
      },
      tunes: {
        footnotes: [
          "It works more stable then in other WYSIWYG editors. Same time it has smooth and well-known arrow navigation behavior like classic editors.",
        ],
      },
    },
    {
      id: "M3UXyblhAo",
      type: "header",
      data: {
        text: "What does it mean clean data output?",
        level: 3,
      },
    },
    {
      id: "KOcIofZ3Z1",
      type: "paragraph",
      data: {
        text: "There are dozens of ready-to-use Blocks and a simple API <sup data-tune='footnotes'>2</sup> for creating any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA buttons, and even games.",
      },
      tunes: {
        footnotes: [
          "Just take a look at our Creating Block Tool guide. You'll be surprised.",
        ],
      },
    },
    {
      id: "ksCokKAhQw",
      type: "paragraph",
      data: {
        text: "Classic WYSIWYG editors produce raw HTML-markup with both content data and content appearance. On the contrary, <mark class='cdx-marker'>Editor.js outputs JSON object</mark> with data of each Block.",
      },
    },
    {
      id: "XKNT99-qqS",
      type: "attaches",
      data: {
        file: {
          url: "https://www.africau.edu/images/default/sample.pdf",
          size: 12902,
          name: "file.pdf",
          extension: "pdf",
        },
        title: "My file",
      },
    },
    {
      type: "quote",
      data: {
        text: "The unexamined life is not worth living.",
        caption: "Socrates",
        alignment: "left",
      },
    },
    {
      type: "table",
      data: {
        withHeadings: true,
        content: [
          ["Kine", "<mark class='cdx-marker'>Pigs</mark>", "Chicken"],
          ["1 pcs", "3 pcs", "12 pcs"],
          ["100$", "200$", "150$"],
        ],
      },
    },
    {
      id: "7RosVX2kcH",
      type: "paragraph",
      data: {
        text: "Given data can be used as you want: render with HTML for Web clients, render natively for mobile apps, create the markup for Facebook Instant Articles or Google AMP, generate an audio version, and so on.",
      },
    },
    {
      id: "eq06PsNsab",
      type: "paragraph",
      data: {
        text: "Clean data is useful to sanitize, validate and process on the backend.",
      },
    },
    {
      id: "eq06PsNgab",
      type: "paragraph",
      data: {
        text: "This is a <strong>big</strong> and <em>smart</em> paragraph.",
      },
    },
    {
      id: "hZAjSnqYMX",
      type: "image",
      data: {
        file: {
          url: "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=3208&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        withBorder: true,
        withBackground: false,
        stretched: true,
        caption: "Unslpash Image under sea",
      },
    },
    // All test data

    {
      id: "heading1",
      type: "header",
      data: {
        text: "Heading 1",
        level: 1,
      },
    },
    {
      id: "heading2",
      type: "header",
      data: {
        text: "Heading 2",
        level: 2,
      },
    },
    {
      id: "heading3",
      type: "header",
      data: {
        text: "Heading 3",
        level: 3,
      },
    },
    {
      id: "heading4",
      type: "header",
      data: {
        text: "Heading 4",
        level: 4,
      },
    },
    {
      id: "heading5",
      type: "header",
      data: {
        text: "Heading 5",
        level: 5,
      },
    },
    {
      id: "heading6",
      type: "header",
      data: {
        text: "Heading 6",
        level: 6,
      },
    },
    {
      id: "paragraph",
      type: "paragraph",
      data: {
        text: "This is a sample paragraph.",
      },
    },
    {
      id: "paragraph",
      type: "paragraph",
      data: {
        text: "<i>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in</i> the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      },
    },
    {
      id: "unorderedList",
      type: "list",
      data: {
        type: "unordered",
        items: ["Item 1", "Item 2", "Item 3"],
      },
    },
    {
      id: "orderedList",
      type: "list",
      data: {
        type: "ordered",
        items: ["Item A", "Item B", "Item C"],
      },
    },
    {
      id: "image",
      type: "image",
      data: {
        file: {
          url: "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?q=80&w=3208&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        caption: "Sample Image",
      },
    },
    {
      id: "attaches",
      type: "attaches",
      data: {
        file: {
          url: "https://www.africau.edu/images/default/sample.pdf",
          size: 12902,
          name: "sample.pdf",
          extension: "pdf",
        },
        title: "Sample Attachment",
      },
    },
    {
      id: "quote",
      type: "quote",
      data: {
        text: "This is a sample quote.",
        caption: "John Doe",
        alignment: "left",
      },
    },
    {
      id: "warning",
      type: "warning",
      data: {
        warning: "This is a warning message.",
      },
    },
    {
      id: "checklist",
      type: "checklist",
      data: {
        checked: true,
        text: "Checked Item",
      },
    },
    {
      id: "table",
      type: "table",
      data: {
        withHeadings: true,
        content: [
          ["Heading 1", "Heading 2", "Heading 3"],
          ["Row 1 Data 1", "Row 1 Data 2", "Row 1 Data 3"],
          ["Row 2 Data 1", "Row 2 Data 2", "Row 2 Data 3"],
        ],
      },
    },
    {
      id: "code",
      type: "code",
      data: {
        language: "javascript",
        code: "console.log('Hello, World!');",
      },
    },
    {
      id: "code",
      type: "code",
      data: {
        language: "cpp",
        code: `#include <iostream>
using namespace std;

int main() {
    int n, t1 = 0, t2 = 1, nextTerm = 0;

    cout << "Enter the number of terms: ";
    cin >> n;

    cout << "Fibonacci Series: ";

    for (int i = 1; i <= n; ++i) {
        // Prints the first two terms.
        if(i == 1) {
            cout << t1 << ", ";
            continue;
        }
        if(i == 2) {
            cout << t2 << ", ";
            continue;
        }
        nextTerm = t1 + t2;
        t1 = t2;
        t2 = nextTerm;
        
        cout << nextTerm << ", ";
    }
    return 0;
}`,
      },
    },

    {
      id: "delimiter",
      type: "delimiter",
      data: {
        delimiter: "<hr />",
      },
    },
  ],
};
