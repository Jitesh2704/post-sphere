import React from "react";
import YourArticleTemplate from "./templates/YourArticleTemplate";

const DraftArticles = ({ data, fetchUserPosts, handleEdit }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-2">
        {data.map((article, index) => (
          <div key={index} className="col-span-6">
            <YourArticleTemplate
              data={article}
              showShareIcon={false}
              isDraft={true}
              showPublish={false}
              fetchUserPosts={fetchUserPosts}
              handleEdit={handleEdit}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftArticles;
