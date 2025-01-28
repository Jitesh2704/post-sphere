import React, { useState, useEffect } from "react";
import SmallPostTemplate from "../My Postings/templates/SmallPostTemplate";
import UserCollectionsService from "../../services/post-service/user-collections.service";

export default function Collections({ userId }) {
  const [userCollects, setUserCollects] = useState([]);
  const [endIndex, setEndIndex] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllCollections = async () => {
      try {
        const response = await UserCollectionsService.getAllUserCollections(
          1,
          10,
          [],
          {
            is_deleted: false,
            user_id: userId,
          }
        );
        setUserCollects(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user collections: ", error.message);
      }
    };

    getAllCollections();
  }, [userId]);

  const handleLoadMore = () => {
    setEndIndex((prevEndIndex) => prevEndIndex + 4);
  };

  return (
    <div>
      <div className="font-bold mt-8 md:mt-0 text-xl xl:text-2xl pb-4 md:pb-6 cursor-pointer">
        Your Collections
      </div>
      {loading ? (
        <div>Please hold on your collections are loading...</div>
      ) : userCollects.length === 0 ? (
        <div>You don't have any posts in your collections.</div>
      ) : (
        <div>
          {userCollects.slice(0, endIndex).map((collection, index) => (
            <div key={index}>
              <SmallPostTemplate post_id={collection.post_id} />
              {/* {index < endIndex - 1 && (
                <hr className="my-4 border-t border-gray-300" />
              )} */}
            </div>
          ))}
          {endIndex < userCollects.length && (
            <div
              className="cursor-pointer text-blue-500"
              onClick={handleLoadMore}
            >
              Load More
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import SmallPostTemplate from "../My Postings/templates/SmallPostTemplate";
// import UserCollectionsService from "../../services/post-service/user-collections.service";

// export default function Collections({ userId }) {
//   const [userCollects, setUserCollects] = useState([]);
//   const [startIndex, setStartIndex] = useState(0);
//   const [endIndex, setEndIndex] = useState(8);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getAllCollections = async () => {
//       try {
//         const response = await UserCollectionsService.getAllUserCollections(1, 10, [], {
//           is_deleted: false,
//           user_id: userId,
//         });
//         // console.log(userId);
//         console.log("user collections", response);
//         setUserCollects(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching user collections: ", error.message);
//       }
//     };

//     getAllCollections();
//   }, [userId]);

//   const handleLoadMore = () => {
//     setStartIndex(startIndex + 8);
//     setEndIndex(endIndex + 8);
//   };

//   return (
//     <div>
//       <div className="font-bold mt-8 md:mt-0 text-xl xl:text-2xl pb-4 md:pb-6 cursor-pointer">
//         Your Collections
//       </div>
//       {loading ? (
//         <div>Please hold on your collections are loading...</div>
//       ) : userCollects.length === 0 ? ( // Check if userCollects is empty
//         <div>You don't have any posts in your collections.</div>
//       ) : (
//         <div>
//           {userCollects &&
//             userCollects
//               .slice(startIndex, endIndex)
//               .map((collection, index) => (
//                 <div key={index}>
//                   <SmallPostTemplate post_id={collection.post_id} />
//                   {/* {index < endIndex - 1 && (
//                     <hr className="my-4 border-t border-gray-300" />
//                   )} */}
//                 </div>
//               ))}
//           {endIndex < userCollects.length && (
//             <div
//               className="cursor-pointer text-blue-500"
//               onClick={handleLoadMore}
//             >
//               Load More
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import SmallPostTemplate from "../My Postings/templates/SmallPostTemplate";
// import UserCollectionsService from "../../services/post-service/user-collections.service";

// export default function Collections({ userId }) {
//   const [userCollects, setUserCollects] = useState([]);
//   const [startIndex, setStartIndex] = useState(0);
//   const [endIndex, setEndIndex] = useState(8);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getAllCollections = async () => {
//       try {
//         const response = await UserCollectionsService.getAllUserCollections(
//           1,
//           32,
//           ["post_id"],
//           { user_id: userId }
//         );
//         setUserCollects(response.data.userCollections || []); // Ensure it's not undefined
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching user collections: ", error.message);
//       }
//     };

//     getAllCollections();
//   }, [userId]);

//   const handleLoadMore = () => {
//     setStartIndex(startIndex + 8);
//     setEndIndex(endIndex + 8);
//   };

//   return (
//     <div>
//       <div className="font-bold mt-8 md:mt-0 text-xl xl:text-2xl pb-4 md:pb-6 cursor-pointer">
//         Your Collections
//       </div>
//       {loading ? (
//         <div>Please hold on your collections are loading...</div>
//       ) : (
//         <div>
//           {userCollects &&
//             userCollects
//               .slice(startIndex, endIndex)
//               .map((collection, index) => (
//                 <div key={index}>
//                   <SmallPostTemplate
//                     post_id={collection.post_id}
//                     author_id={collection.author_id}
//                   />
//                   {index < endIndex - 1 && (
//                     <hr className="my-4 border-t border-gray-300" />
//                   )}
//                 </div>
//               ))}
//           {endIndex < userCollects.length && (
//             <div
//               className="cursor-pointer text-blue-500"
//               onClick={handleLoadMore}
//             >
//               Load More
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import SmallPostTemplate from "../My Postings/templates/SmallPostTemplate";
// import UserCollectionsService from "../../services/post-service/user-collections.service";

// export default function Collections({ userId }) {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [userCollects, setUserCollects] = useState([]);
//   const [startIndex, setStartIndex] = useState(0);
//   const [endIndex, setEndIndex] = useState(8); // Initial display count

//   const getAllCollections = async () => {
//     try {
//       const response = await UserCollectionsService.getAllUserCollections(
//         1, // Page number
//         32, // Fetch up to 100 collections (adjust as needed)
//         ["post_id"], // Fetch only the post_id field
//         { user_id: userId } // Filter by user_id
//       );
//       setUserCollects(response.data.userCollections);
//       setIsLoaded(true);
//     } catch (error) {
//       console.error("Error fetching user collections: ", error.message);
//     }
//   };

//   useEffect(() => {
//     getAllCollections();
//   }, [userId]);

//   const handleLoadMore = () => {
//     const newEndIndex = endIndex + 8;
//     setEndIndex(newEndIndex);
//     setStartIndex(endIndex); // Move start index to current end index
//   };

//   return (
//     <div>
//       <div className="font-bold mt-8 md:mt-0 text-xl xl:text-2xl pb-4 md:pb-6 cursor-pointer">
//         Your Collections
//       </div>
//       {isLoaded ? (
//         <div>
//           {userCollects.slice(startIndex, endIndex).map((collection, index) => (
//             <div key={index}>
//               <SmallPostTemplate
//                 post_id={collection.post_id}
//                 author_id={collection.author_id}
//               />
//               {index < userCollects.length - 1 && (
//                 <hr className="my-4 border-t border-gray-300" />
//               )}
//             </div>
//           ))}
//           {userCollects.length > endIndex && (
//             <div
//               className="cursor-pointer text-blue-500"
//               onClick={handleLoadMore}
//             >
//               Load More
//             </div>
//           )}
//         </div>
//       ) : (
//         <div>Please hold on your collections are loading...</div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SmallPostTemplate from "../templates/SmallPostTemplate";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";

// export default function Collections() {
//   const [showFullList, setShowFullList] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [userCollects, setUserCollects] = useState([]);
//   const user_id = "659fd21774df5f445ddf6ad4";

//   const getCollections = async () => {
//     try {
//       console.log("this is the response in getCollections: ", user_id);
//       const response = await axios.get(
//         `http://localhost:3001/api/posts/allCollections?userId=${user_id}`
//       );

//       setUserCollects(response.data.userCollections); // this is the bookmarked collection
//       setIsLoaded(true);
//     } catch (error) {
//       console.error("Error fetching user collection: ", error.message);
//     }
//   };

//   useEffect(() => {
//     getCollections();
//   }, []);

//   const handleRemoveFromCollection = (articleId) => {
//     console.log("cross button is pressed: ", articleId);
//     const newCollectionData = userCollects.filter(
//       (item) => item?._id !== articleId
//     );
//     setUserCollects(newCollectionData);
//   };

//   const displayedCollections = userCollects
//     ? showFullList
//       ? userCollects
//       : userCollects?.slice(0, 4)
//     : [];

//   return (
//     <div>
//       <div className="font-bold mt-8 md:mt-0 text-xl xl:text-2xl pb-4 md:pb-6 cursor-pointer">
//         Your Collections
//       </div>
//       {isLoaded ? (
//         <div>
//           {displayedCollections.map((collection, index) => (
//             <div key={index}>
//               <div
//                 className="w-full flex justify-end items-center cursor-pointer"
//                 onClick={() => handleRemoveFromCollection(collection._id)}
//               >
//                 <FontAwesomeIcon icon={faTimes} />
//               </div>
//               <SmallPostTemplate data={collection} />
//               {index < displayedCollections.length - 1 && (
//                 <hr className="my-4 border-t border-gray-300" />
//               )}
//             </div>
//           ))}
//           {!showFullList && (
//             <div
//               className="cursor-pointer text-blue-500"
//               onClick={() => setShowFullList(true)}
//             >
//               See the full list
//             </div>
//           )}
//           {showFullList && (
//             <div
//               className="cursor-pointer text-blue-500"
//               onClick={() => setShowFullList(false)}
//             >
//               Show less
//             </div>
//           )}
//         </div>
//       ) : (
//         <div>Please hold on your collections are loading...</div>
//       )}
//     </div>
//   );
// }
