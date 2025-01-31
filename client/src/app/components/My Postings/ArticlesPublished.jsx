import React from "react";
import YourArticleTemplate from "./templates/YourArticleTemplate";

const ArticlesPublished = ({ data, fetchUserPosts, handleEdit }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-2">
        {data.map((post, index) => (
          <div key={index} className="col-span-6">
            <YourArticleTemplate
              data={post}
              showShareIcon={true}
              isDraft={false}
              showPublish={true}
              fetchUserPosts={fetchUserPosts}
              handleEdit={handleEdit}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPublished;
