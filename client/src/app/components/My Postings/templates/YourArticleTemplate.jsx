import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import UserPostsService from "../../../services/post-service/user-posts.service";
import TimeAgo from "./TimeAgo";
import { useSelector } from "react-redux";

const dropdownStyle = {
  position: "absolute",
  backgroundColor: "white",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  border: "1px solid #ccc",
  borderRadius: "4px",
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
};
const dropdownButtonStyle =
  "dropdown-button bg-white text-black p-2 hover:bg-blue-500 hover:border-none cursor-pointer transition duration-300";

const YourArticleTemplate = ({ data }) => {
  const { user } = useSelector((state) => state.auth);
  const current_user_id = user?.user_id;
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  // console.log("here is the data", data)

  const handleDropdownToggle = (event) => {
    const iconPosition = event.target.getBoundingClientRect();

    setDropdownPosition({
      top: iconPosition.bottom + window.scrollY,
      left: iconPosition.left + window.scrollX,
    });
    setShowDropdown(!showDropdown);
  };

  const handleEdit = () => {
    console.log("Edit button clicked");
    setShowDropdown(false);
    navigate(`/edit-form/${data.post_id}`); // Use post_id directly
  };

  const handleDelete = async () => {
    console.log("Delete button clicked");
    setShowDropdown(false);
    try {
      await UserPostsService.deleteUserPost(data.post_id, current_user_id); // Use post_id directly
      console.log("Post marked as deleted");
      // We might want to update the UI or take other actions after successful deletion
    } catch (error) {
      console.error("Error marking post as deleted:", error.message);
      // Handle error, show a notification may be ?
    }
  };

  return (
    <div className="max-w-screen-md mx-auto h-full p-2">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 flex flex-col">
          <p className="font-bold tracking-tight text-lg md:text-xl line-clamp-2 hover:line-clamp-none">
            {data.post_name}
          </p>
          <p className="py-1 my-2 md:my-3 tracking-tight line-clamp-4 md:line-clamp-3">
            {data.post_short_desc}
          </p>
          <div className="flex justify-between">
            <p className="font-medium text-sm md:text-md">
              {data.is_draft ? "Created" : "Published"} About{" "}
              <TimeAgo date={data.cdate_time.toString()} />
            </p>
            <div className="flex justify-between gap-3 md:gap-6">
              <button onClick={handleEdit}>
                <FontAwesomeIcon icon={faPenSquare} />
              </button>
              <FontAwesomeIcon
                icon={faEllipsis}
                onClick={handleDropdownToggle}
              />
            </div>
            {showDropdown && (
              <div
                style={{
                  ...dropdownStyle,
                  top: dropdownPosition.top + "px",
                  left: dropdownPosition.left + "px",
                }}
              >
                <button className={dropdownButtonStyle} onClick={handleEdit}>
                  Edit
                </button>
                <button className={dropdownButtonStyle} onClick={handleDelete}>
                  Delete
                </button>
                <button
                  className={dropdownButtonStyle}
                  onClick={() => navigate(`/show-post/${data.post_id}`)}
                >
                  View Post
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-5">
          <div className="border m-2 md:m-0 h-36 w-auto xl:w-full xl:h-full">
            <img
              className="object-cover h-full w-full"
              src={data.post_img}
              alt="Post Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourArticleTemplate;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShare, faEllipsis, faPenSquare } from "@fortawesome/free-solid-svg-icons";
// import TimeAgo from "./TimeAgo";
// import { useNavigate } from "react-router-dom";

// const dropdownStyle = {
//   position: 'absolute',
//   backgroundColor: 'white',
//   boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//   border: '1px solid #ccc',
//   borderRadius: '4px',
//   zIndex: 100,
//   display: 'flex',
//   flexDirection: 'column',
// };
// const dropdownButtonStyle = 'dropdown-button bg-white text-black p-2 hover:bg-blue-500 hover:border-none cursor-pointer transition duration-300';
// const YourArticleTemplate = ({ data, showShareIcon, showPublish, isDraft, draft_id }) => {
//   // const ejInstance = useRef();
//   // useEffect(() => {
//   //   if (ejInstance.current === null) {
//   //     // whenever the component mounts on the screen, this part will be executed
//   //     ejInstance.current = initEditor();
//   //   }
//   //   return () => {
//   //     // whenever the component unmounts from the screen, this part will be executed
//   //     ejInstance?.current?.destroy();
//   //     ejInstance.current = null;
//   //   };
//   // }, []);

//   const [showDropdown, setShowDropdown] = useState(false);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const handleDropdownToggle = (event) => {
//     const iconPosition = event.target.getBoundingClientRect();

//     setDropdownPosition({
//       top: iconPosition.bottom + window.scrollY,
//       left: iconPosition.left + window.scrollX,
//     });
//     setShowDropdown(!showDropdown);
//   };
//   const navigate = useNavigate();
//   const handleShareClick = () => {
//     // Get the current URL
//     const currentUrl = window.location.href;

//     // Copy the URL to the clipboard
//     navigator.clipboard
//       .writeText(currentUrl)
//       .then(() => {
//         alert("Link copied to clipboard!");
//       })
//       .catch((error) => {
//         console.error("Failed to copy:", error);
//       });
//   };
//   const handleEdit = () => {
//     console.log('Edit button clicked');
//     setShowDropdown(false);
//     navigate(`/post-edit/${data._id}`);
//   };
//   const handleDelete = async () => {
//     console.log("Delete button clicked");
//     setShowDropdown(false);
//     try {
//       const postId = data._id; // Assuming data._id is the post ID; adjust accordingly
//       console.log(postId);
//       // const response = await axios.put(
//       //   `http://localhost:3001/api/post/delete/${postId}`
//       // );
//       const response = await PostServices.deletePost(postId);
//       console.log("Post marked as deleted:", response.data);
//       // You might want to update the UI or take other actions after successful deletion
//     } catch (error) {
//       console.error("Error marking post as deleted:", error.message);
//       // Handle error, show a notification, etc.
//     }
//   };
//   const handleClickPublish = async (content, draft_id) => {
//     console.log(draft_id);
//     console.log("Publish button clicked");
//     setShowDropdown(false);
//     // console.log(ejInstance.current);
//     // if (ejInstance.current) {
//     //   const content = await ejInstance.current.save();
//     // Assuming you have a function savePublishToBackend defined elsewhere
//     savePublishToBackend(content, draft_id);
//     console.log("it is saved");
//     console.log(content);
//     console.log(draft_id);
//     // Clear the editor's content if needed
//     // ejInstance.current.clear();
//     // }
//   };
//   const savePublishToBackend = async (postContent, postId) => {
//     console.log("line 77");
//     console.log(postId);
//     const content = {
//       isDraft: false,
//       postContent,
//     };
//     try {
//       console.log("line 83");
//       // const response = await axios.put(
//       //   `http://localhost:3001/api/articles/${postId}`,
//       //   content
//       // );
//       const response = await PostServices.editPost(postId, content);
//       console.log("Post published successfully:", response.data);
//     } catch (error) {
//       console.error("Error updating post:", error.message);
//     }
//   };
//   return (
//     <div className="max-w-screen-md mx-auto h-full p-2">
//       <div className="flex flex-col">
//         <p className="font-bold tracking-tight text-lg md:text-2xl line-clamp-2 hover:line-clamp-none">
//           {data.post_name}
//         </p>
//         <p className="py-1 my-2 md:my-3 tracking-tight line-clamp-4 md:line-clamp-3 hover:line-clamp-none">
//           {data.post_short_desc}
//         </p>
//         <div className="flex justify-between">
//           <p className="font-medium text-sm md:text-md">
//             {isDraft ? "Created" : "Published"} About{" "}
//             <TimeAgo date={data.date.toString()} />
//           </p>
//           <div className="flex justify-between gap-3 md:gap-6">
//             <button onClick={handleEdit}> <FontAwesomeIcon icon={faPenSquare} /> </button>
//             {showShareIcon && <FontAwesomeIcon icon={faShare} onClick={handleShareClick} />}
//             <FontAwesomeIcon icon={faEllipsis} onClick={handleDropdownToggle} />
//           </div>
//           {showDropdown && (
//             <div
//               style={{
//                 ...dropdownStyle,
//                 top: dropdownPosition.top + "px",
//                 left: dropdownPosition.left + "px",
//               }}
//             >
//               <button className={dropdownButtonStyle} onClick={handleEdit}>
//                 Edit
//               </button>
//               <button className={dropdownButtonStyle} onClick={handleDelete}>
//                 Delete
//               </button>
//               {showPublish && (
//                 <button
//                   className={dropdownButtonStyle}
//                   onClick={() =>
//                     handleClickPublish(data.post_content, data._id)
//                   }
//                 >
//                   Publish
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YourArticleTemplate;

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShare, faEllipsis } from "@fortawesome/free-solid-svg-icons";
// import TimeAgo from "./TimeAgo";

// const dropdownStyle = {
//   position: "absolute",
//   backgroundColor: "white",
//   boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   zIndex: 100,
//   display: "flex",
//   flexDirection: "column",
// };
// const dropdownButtonStyle =
//   "dropdown-button bg-white text-black p-2 hover:bg-blue-500 hover:border-none cursor-pointer transition duration-300";
// const YourArticleTemplate = ({
//   data,
//   showShareIcon,
//   showPublish,
//   isDraft,
//   draft_id,
// }) => {
//   // const ejInstance = useRef();
//   // useEffect(() => {
//   //   if (ejInstance.current === null) {
//   //     // whenever the component mounts on the screen, this part will be executed
//   //     ejInstance.current = initEditor();
//   //   }
//   //   return () => {
//   //     // whenever the component unmounts from the screen, this part will be executed
//   //     ejInstance?.current?.destroy();
//   //     ejInstance.current = null;
//   //   };
//   // }, []);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
//   const handleDropdownToggle = (event) => {
//     const iconPosition = event.target.getBoundingClientRect();
//     setDropdownPosition({
//       top: iconPosition.bottom + window.scrollY,
//       left: iconPosition.left + window.scrollX,
//     });
//     setShowDropdown(!showDropdown);
//   };
//   const handleEdit = () => {
//     console.log("Edit button clicked");
//     setShowDropdown(false);
//   };
//   const handleDelete = async () => {
//     console.log("Delete button clicked");
//     setShowDropdown(false);
//     try {
//       const postId = data._id; // Assuming data._id is the post ID; adjust accordingly
//       console.log(postId);
//       const response = await axios.put(
//         `http://localhost:3001/api/post/delete/${postId}`
//       );
//       console.log("Post marked as deleted:", response.data);
//       // You might want to update the UI or take other actions after successful deletion
//     } catch (error) {
//       console.error("Error marking post as deleted:", error.message);
//       // Handle error, show a notification, etc.
//     }
//   };
//   const handleClickPublish = async (content, draft_id) => {
//     console.log(draft_id);
//     console.log("Publish button clicked");
//     setShowDropdown(false);
//     // console.log(ejInstance.current);
//     // if (ejInstance.current) {
//     //   const content = await ejInstance.current.save();
//     // Assuming you have a function savePublishToBackend defined elsewhere
//     savePublishToBackend(content, draft_id);
//     console.log("it is saved");
//     console.log(content);
//     console.log(draft_id);
//     // Clear the editor's content if needed
//     // ejInstance.current.clear();
//     // }
//   };
//   const savePublishToBackend = async (postContent, postId) => {
//     console.log("line 77");
//     console.log(postId);
//     const content = {
//       isDraft: false,
//       postContent,
//     };
//     try {
//       console.log("line 83");
//       const response = await axios.put(
//         `http://localhost:3001/api/articles/${postId}`,
//         content
//       );
//       console.log("Post published successfully:", response.data);
//     } catch (error) {
//       console.error("Error updating post:", error.message);
//     }
//   };
//   return (
//     <div className="max-w-screen-md mx-auto h-full p-2">
//       <div className="flex flex-col">
//         <p className="font-bold tracking-tight text-lg md:text-2xl line-clamp-2 hover:line-clamp-none">
//           {data.post_name}
//         </p>
//         <p className="py-1 my-2 md:my-3 tracking-tight line-clamp-4 md:line-clamp-3 hover:line-clamp-none">
//           {data.post_short_desc}
//         </p>
//         <div className="flex justify-between">
//           <p className="font-medium text-sm md:text-md">
//             {isDraft ? "Created" : "Published"} About{" "}
//             {/* <TimeAgo date={data.date.toString()} /> */}
//           </p>
//           <div className="flex justify-between gap-3 md:gap-6">
//             {showShareIcon && <FontAwesomeIcon icon={faShare} />}
//             <FontAwesomeIcon icon={faEllipsis} onClick={handleDropdownToggle} />
//           </div>
//           {showDropdown && (
//             <div
//               style={{
//                 ...dropdownStyle,
//                 top: dropdownPosition.top + "px",
//                 left: dropdownPosition.left + "px",
//               }}
//             >
//               <button className={dropdownButtonStyle} onClick={handleEdit}>
//                 Edit
//               </button>
//               <button className={dropdownButtonStyle} onClick={handleDelete}>
//                 Delete
//               </button>
//               {showPublish && (
//                 <button
//                   className={dropdownButtonStyle}
//                   onClick={() =>
//                     handleClickPublish(data.post_content, data._id)
//                   }
//                 >
//                   Publish
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default YourArticleTemplate;
