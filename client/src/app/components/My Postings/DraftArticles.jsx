import React from "react";
import YourArticleTemplate from "./templates/YourArticleTemplate";

const DraftArticles = ({ data }) => {
  return (
    <div className="max-w-screen-xl mx-auto py-3 md:py-3">
      <div className="flex flex-col w-full h-full">
        <div>
          {!data || data.length === 0 ? (
            <div className="text-center font-semibold text-lg">
              You haven't started any drafts yet.
            </div>
          ) : (
            data.map((article, index) => (
              <div key={index}>
                <YourArticleTemplate
                  data={article.data}
                  showShareIcon={false}
                  isDraft={true}
                  showPublish={false}
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

export default DraftArticles;
