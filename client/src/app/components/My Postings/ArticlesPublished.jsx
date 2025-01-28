import React from "react";
import YourArticleTemplate from "./templates/YourArticleTemplate";

const ArticlesPublished = ({ data }) => {
  // console.log("I am being called");
  // console.log("this in template", data.data);
  return (
    <div className="max-w-screen-xl mx-auto py-3 md:py-3">
      <div className="flex flex-col w-full h-full">
        <div>
          {data.length === 0 ? (
            <div className="text-center font-semibold text-lg">
              You haven't published any articles yet.
            </div>
          ) : (
            data.map((post, index) => (
              <div key={index}>
                <YourArticleTemplate
                  data={post.data}
                  showShareIcon={true}
                  isDraft={false}
                  showPublish={true}
                />
                {index < data.length - 1 && (
                  <hr className="mt-4 mb-2 border-t border-gray-300" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPublished;
