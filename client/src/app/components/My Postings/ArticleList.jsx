import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faShare,
  faEllipsisH,
  faChevronDown,
  faChevronUp,
  faArrowCircleRight,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import TimeAgo from "./templates/TimeAgo";
import { faOpencart } from "@fortawesome/free-brands-svg-icons";
import { FaArrowCircleLeft } from "react-icons/fa";

const ArticlesList = ({ data }) => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  // console.log("in list", data);

  // Ensure data is defined before attempting to slice it
  const visibleArticles =
    data && data.length > 0
      ? showMore
        ? data
        : data.slice(0, 3)
      : [];

  const handleSeeMoreClick = () => {
    setShowMore(true);
  };

  const handleSeeLessClick = () => {
    setShowMore(false);
  };

 const handleOpenPostClick = (postId) => {
   navigate(`/show-post/${postId}`);
 };

  return (
    <div>
      <div className="mt-4 md:mt-12 grid grid-cols-12 gap-6 lg:gap-8 xl:gap-12 ">
        {visibleArticles.map((article) => (
          <div key={article.post_id} className="col-span-12 md:col-span-6 xl:col-span-4">
            <div className="h-full grid grid-cols-12 rounded-lg border-2 border-gray-300  p-2">
              <div className="col-span-12 cursor-pointer">
                <img
                  className="w-full object-cover"
                  alt="Article Image"
                  src={article.post_img}
                />
                <div className="flex flex-col items-start mt-6 mb-3">
                  <p className="font-bold text-2xl text-black tracking-tight line-clamp-2">
                    {article.post_name}
                  </p>
                  <p className="overflow-hidden mt-3 mb-2 line-clamp-2">
                    {article.post_short_desc}
                  </p>
                </div>
                <div className="inline-flex items-center mt-3 mb-6 mx-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      className="object-cover w-full h-full"
                      src={article.post_author.img}
                      alt="https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg"
                    />
                  </div>
                  <div className="inline-flex items-center gap-6">
                    <div className="ml-4">{article.post_author.name}</div>
                    <div className="font-semibold text-md">
                      <TimeAgo date={article.cdate_time} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mx-4 mb-4">
                  <div className="inline-flex items-start gap-16">
                    <div className="inline-flex items-center">
                      <FontAwesomeIcon icon={faThumbsUp} size="lg" />
                      <span className="ml-2">{article.like_count}</span>
                    </div>
                    <div className="inline-flex items-center">
                      {/* <FontAwesomeIcon icon={faComment} size="lg" /> */}
                      {/* <span className="ml-2">
                      {article.comments?.length || 0}
                    </span> */}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-8">
                    <button className="inline-flex items-start hover:text-blue-600" title="View Post">
                      <FontAwesomeIcon
                        icon={faArrowRightLong}
                        size="xl"
                        onClick={() => handleOpenPostClick(article.post_id)}
                      />
                    </button>
                    <div>
                      {/* <FontAwesomeIcon icon={faEllipsisH} size="lg" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {data && data.length > 3 && (
          <div className="col-span-12">
            {showMore ? (
              <button
                className="text-blue-500 font-semibold tracking-tight text-xs md:text-md xl:text-lg"
                onClick={handleSeeLessClick}
              >
                <FontAwesomeIcon icon={faChevronUp} className="mr-2" />
                See Less
              </button>
            ) : (
              <button
                className="text-blue-500 font-semibold tracking-tight text-xs md:text-md xl:text-lg"
                onClick={handleSeeMoreClick}
              >
                <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
                See More Articles from Author
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesList;

// import React, { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faThumbsUp,
//   faComment,
//   faShare,
//   faEllipsisH,
//   faChevronDown,
//   faChevronUp,
// } from "@fortawesome/free-solid-svg-icons";

// const ArticlesList = ({ data }) => {
//   const [showMore, setShowMore] = useState(false);

//   const visibleArticles = showMore ? data : data.slice(0, 4);

//   const handleSeeMoreClick = () => {
//     setShowMore(true);
//   };

//   const handleSeeLessClick = () => {
//     setShowMore(false);
//   };

//   return (
//     <div className="mt-4 md:mt-12 grid grid-cols-12 gap-6 lg:gap-8 xl:gap-12">
//       {visibleArticles.map((article) => (
//         <div key={article.post_id} className="col-span-12 md:col-span-6">
//           <div className="grid grid-cols-12">
//             <div className="col-span-12 cursor-pointer">
//               <img
//                 className="w-full h-48 md:h-56 lg:h-64 xl:h-72 object-cover"
//                 alt="Article Image"
//                 src={article.post_img}
//               />
//               <div className="flex flex-col items-start mt-6 mb-3">
//                 <p className="font-bold text-2xl text-black tracking-tight line-clamp-2">
//                   {article.post_name}
//                 </p>
//                 <p className="overflow-hidden mt-3 mb-2 line-clamp-2">
//                   {article.post_short_desc}
//                 </p>
//               </div>
//               <div className="inline-flex items-center mt-3 mb-6 mx-1">
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                   <img
//                     className="object-cover w-full h-full"
//                     src={article.post_author.img}
//                     alt={article.post_author.name + " Profile Image"}
//                   />
//                 </div>
//                 <div className="inline-flex items-center gap-6">
//                   <div className="ml-4">{article.post_author.name}</div>
//                   <div className="opacity-60">{article.cdate_time}</div>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mx-4 mb-4">
//                 <div className="inline-flex items-start gap-16">
//                   <div className="inline-flex items-center">
//                     <FontAwesomeIcon icon={faThumbsUp} size="lg" />
//                     <span className="ml-2">{article.like_count}</span>
//                   </div>
//                   <div className="inline-flex items-center">
//                     <FontAwesomeIcon icon={faComment} size="lg" />
//                     {/* <span className="ml-2">
//                       {article.comments?.length || 0}
//                     </span> */}
//                   </div>
//                 </div>
//                 <div className="inline-flex items-center gap-8">
//                   <div className="inline-flex items-start ">
//                     <FontAwesomeIcon icon={faShare} size="lg" />
//                   </div>
//                   <div>
//                     <FontAwesomeIcon icon={faEllipsisH} size="lg" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//       {data.length > 4 && (
//         <div className="col-span-12">
//           {showMore ? (
//             <button
//               className="text-blue-500 font-semibold tracking-tight text-xs md:text-md xl:text-lg"
//               onClick={handleSeeLessClick}
//             >
//               <FontAwesomeIcon icon={faChevronUp} className="mr-2" />
//               See Less
//             </button>
//           ) : (
//             <button
//               className="text-blue-500 font-semibold tracking-tight text-xs md:text-md xl:text-lg"
//               onClick={handleSeeMoreClick}
//             >
//               <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
//               See More Articles from Author
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArticlesList;

// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faThumbsUp,
//   faComment,
//   faShare,
//   faEllipsisH,
//   faChevronDown,
//   faChevronUp,
// } from "@fortawesome/free-solid-svg-icons";
// import articlesDataSet from "../dataSet/articlesDataSet";

// const ArticlesList = () => {
//   const [showMore, setShowMore] = useState(false);

//   const visibleArticles = showMore
//     ? articlesDataSet
//     : articlesDataSet.slice(0, 4);

//   const handleSeeMoreClick = () => {
//     setShowMore(true);
//   };

//   const handleSeeLessClick = () => {
//     setShowMore(false);
//   };

//   return (
//     <div className="mt-4 md:mt-12 grid grid-cols-12 gap-6 lg:gap-8 xl:gap-12">
//       {visibleArticles.map((article) => (
//         <div key={article.article_id} className="col-span-12 md:col-span-6">
//           <div className="grid grid-cols-12">
//             <div className="col-span-12 cursor-pointer">
//               <img
//                 className="w-full h-48 md:h-56 lg:h-64 xl:h-72 object-cover"
//                 alt="Article Image"
//                 src={article.postImg}
//               />
//               <div className="flex flex-col items-start mt-6 mb-3">
//                 <p className="font-bold text-2xl text-black tracking-tight line-clamp-2">
//                   {article.postTitle}
//                 </p>
//                 <p className="overflow-hidden mt-3 mb-2 line-clamp-2">
//                   {article.postDesc}
//                 </p>
//               </div>
//               <div className="inline-flex items-center mt-3 mb-6 mx-1">
//                 <div className="w-10 h-10 rounded-full overflow-hidden">
//                   <img
//                     className="object-cover w-full h-full"
//                     src={article.userImg}
//                     alt={article.userName + "Profile Image"}
//                   />
//                 </div>
//                 <div className="inline-flex items-center gap-6">
//                   <div className="ml-4">{article.userName}</div>
//                   <div className="opacity-60">{article.publishDate}</div>
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mx-4 mb-4">
//                 <div className="inline-flex items-start gap-16">
//                   <div className="inline-flex items-center">
//                     <FontAwesomeIcon icon={faThumbsUp} size="lg" />
//                     <span className="ml-2">{article.likes}</span>
//                   </div>
//                   <div className="inline-flex items-center">
//                     <FontAwesomeIcon icon={faComment} size="lg" />
//                     <span className="ml-2">
//                       {article.comments?.length || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="inline-flex items-center gap-8">
//                   <div className="inline-flex items-start ">
//                     <FontAwesomeIcon icon={faShare} size="lg" />
//                   </div>
//                   <div>
//                     <FontAwesomeIcon icon={faEllipsisH} size="lg" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//       {articlesDataSet.length > 4 && (
//         <div className="col-span-12">
//           {showMore ? (
//             <button
//               className="text-blue-500 font-semibold tracking-tight text-xs md:text-md xl:text-lg"
//               onClick={handleSeeLessClick}
//             >
//               <FontAwesomeIcon icon={faChevronUp} className="mr-2" />
//               See Less
//             </button>
//           ) : (
//             <button
//               className="text-blue-500 font-semibold tracking-tight text-xs md:text-md xl:text-lg"
//               onClick={handleSeeMoreClick}
//             >
//               <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
//               See More Articles from Author
//             </button>
//           )}
//         </div>
//       )}

//     </div>
//   );
// };

// export default ArticlesList;
