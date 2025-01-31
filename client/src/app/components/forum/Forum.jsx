/* eslint-disable */
// pending Rating, upvote, downvote, reply to reply and the react quill parser image show glitch
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faChevronLeft,
  faChevronRight,
  faArrowLeft,
  faComments,
  faArrowUp,
  faArrowDown,
  faReply,
  faPlusCircle,
  faTrashAlt,
  faEdit,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { toast } from "react-toastify";
import ReactQuillParser from "../ReactQuillComponent/ReactQuillParser.jsx";
import ForumService from "../../services/forum-service/forum.service.js";
import ForumThreadService from "../../services/forum-service/forum-thread.service.js";
import ThreadReplyService from "../../services/forum-service/thread-reply.service";
import UpvoteService from "../../services/forum-service/upVote.service.js";
import AuthService from "../../services/auth-service/auth.service.js";
import { CustomQuillEditor } from "../ReactQuillComponent/ReactQuill.jsx";

const Star = ({ filled }) => (
  <svg
    className={`h-6 w-6 ${filled ? "text-yellow-500" : "text-gray-400"}`}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    {filled ? (
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    ) : (
      <path d="M22 9.24h-7.19l-2.81-8-2.81 8H2l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z" />
    )}
  </svg>
);

const StarRating = ({ initialRating, onRating, isEditable = true }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const changeRating = (newRating) => {
    if (!isEditable) return;
    setRating(newRating);
    if (onRating) onRating(newRating);
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5]?.map((index) => (
        <button
          type="button"
          key={index}
          className={`focus:outline-none ${
            isEditable ? "" : "pointer-events-none"
          }`}
          onMouseEnter={() => isEditable && setHoverRating(index)}
          onMouseLeave={() => isEditable && setHoverRating(0)}
          onClick={() => changeRating(index)}
          aria-label={`Rate ${index} out of 5`}
        >
          <Star filled={index <= (hoverRating || rating)} />
        </button>
      ))}
    </div>
  );
};

const RepliesComponent = ({
  threadId,
  forumId,
  handleRefreshNumberOfReplies,
  numberOfReplies,
}) => {
  const [replies, setReplies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const [editingReplyId, setEditingReplyId] = useState(null);

  const fetchRepliesAndCreators = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await ThreadReplyService.getAllThreadReplies(
        page,
        10,
        [],
        { forum_id: forumId, thread_id: threadId }
      );
      const responseData = response.data ? response.data : response;
      console.log(responseData);
      if (responseData.replies && responseData.replies.length > 0) {
        const creatorIds = responseData?.replies?.map(
          (reply) => reply.created_by
        );
        const creatorsResponse = await AuthService.getAllAuthUsers(
          1,
          creatorIds.length,
          ["username", "user_id", "fname", "lname", "profile_image"],
          { user_id: creatorIds }
        );
        const creators = creatorsResponse.data
          ? creatorsResponse.data
          : creatorsResponse;
        console.log(creators);

        const repliesWithCreators = responseData.replies?.map((reply) => ({
          ...reply,
          creator:
            creators.find((creator) => creator.user_id === reply.created_by) ||
            {},
        }));

        console.log(repliesWithCreators);

        setReplies((prevReplies) => [...prevReplies, ...repliesWithCreators]);
        setHasMore(response.data.length === 10);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching replies or creators:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [threadId, page, loading, hasMore]);

  // const onAddOrUpdateReply = useCallback(() => {
  //     fetchRepliesAndCreators();
  //     setEditingReplyId(null); // Reset editing state
  // }, [fetchRepliesAndCreators]);

  const onAddOrUpdateReply = (reply_id, reply) => {
    if (reply_id) {
      setReplies((prev) => {
        return prev?.map((p) => {
          if (p.reply_id === reply_id) {
            console.log(reply_id, {
              ...p,
              ...reply,
            });
            return {
              ...p,
              ...reply,
            };
          } else {
            return p;
          }
        });
      });
      setEditingReplyId(null);
    } else {
      console.log(reply);
      setReplies((prev) => {
        return [
          {
            ...reply,
            creator: user,
          },
          ...prev,
        ];
      });
    }
    handleRefreshNumberOfReplies();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchRepliesAndCreators();
        }
      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    // Cleanup function to remove the observer when the component unmounts
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [fetchRepliesAndCreators, hasMore]); // Dependencies for the useEffect hook

  const handleEditClick = (replyId) => {
    setEditingReplyId(replyId); // Set the currently editing reply's ID
  };

  const handleVote = useCallback((replyId, isUpvote) => {
    // Example voting logic
    setReplies((currentReplies) =>
      currentReplies?.map((reply) => {
        if (reply.reply_id === replyId) {
          return {
            ...reply,
            upvotes: isUpvote ? reply.upvotes + 1 : reply.upvotes,
            downvotes: !isUpvote ? reply.downvotes + 1 : reply.downvotes,
          };
        }
        return reply;
      })
    );

    // Here, integrate with your API to reflect the change in the backend.
  }, []);

  // Simulate reply action
  const handleReplyToReply = (replyId) => {
    console.log(`Replying to ${replyId}`);
    // Trigger a form or action to reply to a specific reply
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const response = await ThreadReplyService.deleteThreadReply(
        replyId,
        user.user_id
      );
      setReplies((prev) => {
        return prev.filter((p) => p.reply_id !== replyId);
      });
      handleRefreshNumberOfReplies();

      toast.success("The Reply has been deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete the reply.");
    }
  };

  const handleOnCancel = async () => {
    setEditingReplyId(null);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {numberOfReplies} Replies
      </h3>
      <RepliesActionComponent
        threadId={threadId}
        forumId={forumId}
        onAddOrUpdateReply={onAddOrUpdateReply}
      />
      {/* Conditionally render the add reply form */}
      {replies?.map((reply, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow mb-6 relative transition duration-300 hover:shadow-lg"
        >
          {editingReplyId === reply.reply_id && (
            <>
              <RepliesActionComponent
                threadId={threadId}
                forumId={forumId}
                onAddOrUpdateReply={onAddOrUpdateReply}
                isEditMode={true}
                existingReply={reply}
                onCancel={setEditingReplyId}
              />
            </>
          )}
          {/* Render edit form for the current reply if it's being edited */}
          {editingReplyId !== reply.reply_id && (
            <>
              {/* Administrative Buttons (Top Right) */}
              {user.user_id === reply.created_by && (
                <div className="absolute top-4 right-4 flex items-center space-x-3">
                  <button
                    className="text-slate-400 hover:text-yellow-500 transition duration-300"
                    onClick={() => handleEditClick(reply.reply_id)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                  </button>
                  <button
                    className="text-slate-400 hover:text-red-500 transition duration-300"
                    onClick={() => handleDeleteReply(reply.reply_id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex items-start space-x-6">
                <Avatar creator={reply.creator} />
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-gray-900">
                    {reply.creator.fname} {reply.creator.lname}{" "}
                    <span className="text-sm text-gray-600">
                      (@{reply.creator.username || "Anonymous"})
                    </span>
                  </h4>
                  <div className="mt-3 text-gray-700 space-y-2">
                    <ReactQuillParser content={reply.reply_content} />
                  </div>
                  <p className="mt-3 text-sm text-gray-500">
                    Posted {dayjs(reply.cdate_time).fromNow()}
                  </p>
                  {/* Align vote and reply buttons with content */}
                  <div className="flex items-center space-x-3 mt-3">
                    <button
                      onClick={() => handleVote(reply.reply_id, true)}
                      className="flex items-center text-slate-400 hover:text-blue-800 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4" />
                      <span className="ml-2 text-sm font-semibold">
                        {reply.upvotes}
                      </span>
                    </button>
                    <button
                      onClick={() => handleVote(reply.reply_id, false)}
                      className="flex items-center text-slate-400 hover:text-red-800 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4" />
                      <span className="ml-2 text-sm font-semibold">
                        {reply.downvotes}
                      </span>
                    </button>
                    <button
                      onClick={() => handleReplyToReply(reply.reply_id)}
                      className="flex items-center text-slate-400 hover:text-green-800 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faReply} className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
      {loading && <div className="text-center py-4">Loading...</div>}
      <div ref={loader} className="invisible"></div>
    </div>
  );
};

const RepliesActionComponent = ({
  threadId,
  forumId,
  onAddOrUpdateReply,
  isEditMode = false,
  onCancel,
  existingReply,
}) => {
  const [showForm, setShowForm] = useState(isEditMode || false);
  const [replyContent, setReplyContent] = useState(
    isEditMode && existingReply ? existingReply.reply_content : ""
  );
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error("Please enter your reply.");
      return;
    }

    try {
      if (isEditMode) {
        const replyData = {
          reply_content: replyContent,
          modified_by: user.user_id,
          mdate_time: Date.now(),
        };
        // API call to update the reply
        await ThreadReplyService.updateThreadReply(
          existingReply.reply_id,
          replyData
        );
        onAddOrUpdateReply(existingReply.reply_id, replyData);
        toast.success("Reply updated successfully!");
      } else {
        const replyData = {
          forum_id: forumId,
          thread_id: threadId,
          reply_content: replyContent,
          created_by: user.user_id,
          cdate_time: Date.now(),
        };

        // API call to add a new reply
        const response = await ThreadReplyService.createThreadReply(replyData);
        console.log(replyData);
        onAddOrUpdateReply(null, response.data);
        toast.success("Reply added successfully!");
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} reply:`,
        error
      );
      toast.error(`Failed to ${isEditMode ? "update" : "add"} reply.`);
    }

    setReplyContent("");
    setShowForm(false);
  };

  return (
    <div>
      {!showForm && !isEditMode && (
        <button
          type="button"
          onClick={() => {
            console.log(showForm);
            setShowForm(!showForm);
          }}
          className="text-sm font-medium py-2 px-4 mb-3 rounded-full shadow-sm transition-colors duration-300 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add Reply <FontAwesomeIcon icon={faReply} className="ml-2" />
        </button>
      )}
      {showForm && (
        <div className="mt-4">
          <div className="bg-white p-6 rounded-lg shadow-md transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {isEditMode ? "Edit Reply" : "Your Reply"}
            </h2>
            <form onSubmit={handleSubmit}>
              <CustomQuillEditor
                data={replyContent}
                onChange={setReplyContent}
                // uploadService={imageService.uploadImage}
                purpose={"forum"}
                placeholder={"Enter your reply here"}
              />
              <div className="flex justify-end items-center mt-4 space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(!showForm);
                    onCancel && onCancel();
                  }}
                  className={`text-sm font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-300 ${"bg-red-500 hover:bg-red-600 text-white"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`text-sm font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-300 ${"bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                  Post Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Avatar = ({ creator }) => {
  const [imageError, setImageError] = useState(false);

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string?.length; i++) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  };

  if (!imageError && creator?.profile_image) {
    return (
      <img
        className="h-12 w-12 rounded-full object-cover mr-4"
        src={creator.profile_image}
        alt={`${creator.username}'s profile`}
        onError={() => setImageError(true)}
      />
    );
  } else {
    return (
      <div
        className="h-12 w-12 rounded-full mr-4 flex items-center justify-center"
        style={{ backgroundColor: stringToColor(creator?.username) }}
      >
        <span className="text-xl font-medium text-white">
          {creator?.username?.charAt(0)?.toUpperCase()}
        </span>
      </div>
    );
  }
};

const ThreadComponent = ({
  thread,
  setThreads,
  onClickThread,
  onRepliesClick,
  totalReplies,
  forumType,
  usersAllowed = [],
}) => {
  const [upvotes, setUpvotes] = useState(thread.upvotes || 0);
  const [downvotes, setDownvotes] = useState(thread.downvotes || 0);
  const [showEdit, setShowEdit] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleUpvote = async () => {
    // Increment locally for immediate feedback, actual increment should be handled via API
    setUpvotes((prevUpvotes) => prevUpvotes + 1);
  };

  const handleDownvote = async () => {
    // Decrement locally for immediate feedback, actual decrement should be handled via API
    setDownvotes((prevDownvotes) => prevDownvotes + 1);
  };

  const handleDeleteThread = async () => {
    try {
      const response = await ForumThreadService.deleteForumThread(
        thread.thread_id,
        user.user_id
      );

      setThreads((prev) => {
        return prev.filter((p) => p.thread_id !== thread.thread_id);
      });

      toast.success("The thread has been deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete the thread.");
    }
  };

  return (
    <>
      {showEdit && (
        <ThreadActionComponent
          forumId={thread.forum_id}
          onAddOrUpdateThread={(e) => {
            setThreads((prev) => {
              return prev?.map((t) => {
                if (t.thread_id === thread.thread_id) {
                  return {
                    ...t,
                    thread_topic: e.thread_topic,
                    thread_content: e.thread_content,
                  };
                } else {
                  return t;
                }
              });
            });
            setShowEdit(false);
          }} // Replace with your actual thread fetching/updating function
          isEditMode={true}
          existingThread={thread}
          onCancel={() => setShowEdit(false)}
        />
      )}
      {!showEdit && (
        <div
          key={thread.thread_id}
          className="mb-1 flex flex-col md:flex-row items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group"
        >
          <Avatar creator={thread.creator} />
          <div className="flex-grow mt-4 md:mt-0 md:ml-6">
            <div className="flex justify-between">
              <div>
                <h3
                  className="text-lg md:text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                  onClick={() => onClickThread(thread.thread_id)}
                >
                  {thread.thread_topic}
                </h3>
                <p className="text-sm text-gray-600 mt-1 cursor-default">
                  {thread.creator.fname} {thread.creator.lname} (@
                  {thread.creator.username})
                </p>
                <p className="text-sm font-medium text-gray-500 mt-1 cursor-default">
                  {dayjs(thread.cdate_time).fromNow()}
                </p>
              </div>
              {/* Conditional rendering based on user being the creator */}
              {user?.user_id === thread.created_by && (
                <div className="flex items-center space-x-2">
                  <button
                    className="text-slate-400 hover:text-yellow-600 transition duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowEdit(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                  </button>
                  <button
                    className="text-slate-400 hover:text-red-600 transition duration-300"
                    onClick={handleDeleteThread}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {(forumType !== "noticeboard" ||
              (forumType === "noticeboard" &&
                usersAllowed.includes(user?.user_id))) && (
              <div className="flex items-center space-x-3 mt-3">
                {forumType === "rating" && (
                  <StarRating
                    initialRating={thread.rating_stars}
                    isEditable={false}
                  />
                )}
                <button
                  onClick={handleUpvote}
                  className="flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4" />
                  <span className="ml-2 text-sm font-semibold">{upvotes}</span>
                </button>
                <button
                  onClick={handleDownvote}
                  className="flex items-center text-gray-500 hover:text-red-500 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4" />
                  <span className="ml-2 text-sm font-semibold">
                    {downvotes}
                  </span>
                </button>
                <button
                  onClick={() => onClickThread(thread.thread_id)}
                  className="flex items-center text-gray-500 hover:text-green-500 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faComments} className="h-4 w-4" />
                  <span className="ml-2 text-sm font-semibold">
                    {totalReplies || 0}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const SingleThreadComponent = ({
  thread,
  onBack,
  setThreads,
  refreshNumberOfReplies,
  numberOfReplies,
  setSelectedThread,
  forumType,
  usersAllowed,
}) => {
  const [upvotes, setUpvotes] = useState(thread.upvotes || 0);
  const [downvotes, setDownvotes] = useState(thread.downvotes || 0);
  const [showEdit, setShowEdit] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Function to handle the upvote action
  const handleUpvote = () => {
    setUpvotes(upvotes + 1); // Increment the upvotes by 1
    // Integrate API call to update upvote in backend
  };

  // Function to handle the downvote action
  const handleDownvote = () => {
    setDownvotes(downvotes + 1); // Increment the downvotes by 1
    // Integrate API call to update downvote in backend
  };

  const handleRefreshNumberOfReplies = async () => {
    refreshNumberOfReplies(thread.thread_id);
  };

  const handleDeleteThread = async () => {
    try {
      const response = await ForumThreadService.deleteForumThread(
        thread.thread_id,
        user.user_id
      );

      setThreads((prev) => {
        return prev.filter((p) => p.thread_id !== thread.thread_id);
      });

      setSelectedThread(null);

      toast.success("The thread has been deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete the thread.");
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 transition duration-300 ease-in-out flex items-center"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to
          threads
        </button>
        {user?.user_id === thread.created_by && (
          <div className="flex items-center space-x-2">
            <button
              className="text-gray-500 hover:text-yellow-600 transition duration-300 ease-in-out mx-2"
              onClick={(e) => {
                e.preventDefault();
                setShowEdit((prev) => !prev);
              }}
            >
              <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />{" "}
              {/* Edit action */}
            </button>
            <button
              className="text-gray-500 hover:text-red-600 transition duration-300 ease-in-out mx-2"
              onClick={handleDeleteThread}
            >
              <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4" />{" "}
              {/* Delete action */}
            </button>
          </div>
        )}
      </div>
      {showEdit &&
      (forumType !== "noticeboard" ||
        (forumType === "noticeboard" &&
          usersAllowed?.includes(user?.user_id))) ? (
        <ThreadActionComponent
          forumId={thread.forum_id}
          onAddOrUpdateThread={(e) => {
            setThreads((prev) => {
              return prev?.map((t) => {
                if (t.thread_id === thread.thread_id) {
                  return {
                    ...t,
                    thread_topic: e.thread_topic,
                    thread_content: e.thread_content,
                  };
                } else {
                  return t;
                }
              });
            });
            setShowEdit(false);
          }} // Replace with your actual thread fetching/updating function
          isEditMode={true}
          existingThread={thread}
          onCancel={() => setShowEdit(false)}
        />
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            {thread.thread_topic}
          </h2>
          <div className="border-b border-gray-200 mb-4">
            {forumType === "rating" && (
              <StarRating
                initialRating={thread.rating_stars}
                isEditable={false}
              />
            )}
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <div>
              <div className="text-sm font-medium">
                Created by{" "}
                <span className="text-blue-500">
                  {thread.creator?.username}
                </span>
              </div>
              <div className="text-sm">
                {dayjs(thread.cdate_time).fromNow()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleUpvote}
                className="text-gray-500 hover:text-blue-600 transition-colors duration-300 ease-in-out flex items-center"
              >
                <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5" />
                <span className="ml-1">{upvotes}</span>
              </button>
              <button
                onClick={handleDownvote}
                className="text-gray-500 hover:text-red-600 transition-colors duration-300 ease-in-out flex items-center"
              >
                <FontAwesomeIcon icon={faArrowDown} className="h-5 w-5" />
                <span className="ml-1">{downvotes}</span>
              </button>
            </div>
          </div>
          {thread.thread_content && (
            <div className="mt-4 text-gray-700">
              <ReactQuillParser content={thread.thread_content} />
            </div>
          )}
        </>
      )}
      {(forumType !== "noticeboard" ||
        (forumType === "noticeboard" &&
          usersAllowed?.includes(user?.user_id))) && (
        <RepliesComponent
          forumId={thread.forum_id}
          threadId={thread.thread_id}
          handleRefreshNumberOfReplies={handleRefreshNumberOfReplies}
          numberOfReplies={numberOfReplies}
        />
      )}
    </div>
  );
};

const ThreadActionComponent = ({
  forumId,
  onAddOrUpdateThread,
  isEditMode = false,
  existingThread,
  forumType,
  onCancel,
}) => {
  const [showForm, setShowForm] = useState(isEditMode || false);
  const [topic, setTopic] = useState(
    isEditMode && existingThread ? existingThread.thread_topic : ""
  );
  const [content, setContent] = useState(
    isEditMode && existingThread ? existingThread.thread_content : ""
  );
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0); // Assume 0 as no rating
  const [disablePost, setDisablePost] = useState(false);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisablePost(true);
    if (!topic.trim() || !content.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      if (isEditMode) {
        const threadData = {
          thread_topic: topic,
          thread_content: content,
          rating_stars: rating,
          modified_by: user.user_id,
          mdate_time: Date.now(),
        };
        // API call to update the thread
        await ForumThreadService.updateForumThread(
          existingThread.thread_id,
          threadData
        );
        onAddOrUpdateThread(threadData); // Refresh the thread list or update the individual thread in the parent component
        toast.success("Thread updated successfully!");
      } else {
        const threadData = {
          forum_id: forumId,
          thread_topic: topic,
          thread_content: content,
          rating_stars: rating,
          created_by: user.user_id,
          cdate_time: Date.now(),
        };

        // API call to create a thread
        await ForumThreadService.createForumThread(threadData);
        onAddOrUpdateThread(threadData); // Refresh the thread list or update the individual thread in the parent component
        toast.success("Thread added successfully!");
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} thread:`,
        error
      );
      toast.error(`Failed to ${isEditMode ? "update" : "add"} thread.`);
    }

    setTopic("");
    setContent("");
    setDisablePost(false);
    setShowForm(false);
  };

  return (
    <div className="flex justify-end items-center">
      {!showForm && !isEditMode && (
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className={`text-sm font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-300 ${"bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          {"Add New Thread"}{" "}
          <FontAwesomeIcon icon={faPlusCircle} className="ml-2" />
        </button>
      )}
      {showForm && (
        <div className="mt-4 w-full">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">
              {isEditMode ? "Edit Thread" : "Create New Thread"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Thread Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 text-sm text-gray-700 bg-gray-100 rounded border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-300"
              />
              {forumType === "rating" && (
                <StarRating initialRating={rating} onRating={setRating} />
              )}{" "}
              {/* Star rating component */}
              <CustomQuillEditor
                data={content}
                onChange={setContent}
                placeholder={"Enter Thread Content here"}
                // uploadService={imageService.uploadImage}
                purpose={"forum"}
              />
              <div className="flex justify-end items-center space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    onCancel && onCancel();
                  }}
                  className={`text-sm font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-300 ${"bg-red-500 hover:bg-red-600 text-white"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`text-sm font-medium py-2 px-4 rounded-full shadow-sm transition-colors duration-300 ${"bg-blue-500 hover:bg-blue-600 text-white"}`}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function Forum({ forum_id, usersAllowed = [] }) {
  const { id } = useParams();
  const [forum, setForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState(null);
  const [totalReplies, setTotalReplies] = useState([]);
  const forumId = id || forum_id;
  const [threadCount, setThreadCount] = useState(0);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchThreads(currentPage);
  }, [currentPage]);

  const refreshNumberOfReplies = async (threadId) => {
    const response = await ThreadReplyService.getTotalThreadRepliesCount({
      forum_id: forumId,
      thread_id: threadId,
    });

    console.log(response);

    setTotalReplies((prev) => {
      return prev?.map((p) => {
        if (p.thread_id === threadId) {
          return response.data ? response.data : response;
        } else {
          return p;
        }
      });
    });
  };

  const fetchThreads = async (page) => {
    setLoading(true);
    try {
      // Fetch forum threads
      const threadsResponse = await ForumThreadService.getAllForumThreads(
        page,
        -1,
        [],
        {
          forum_id: forumId,
        }
      );
      setThreadCount(threadsResponse.totalItems);
      const threadsData = threadsResponse.data ? threadsResponse.data : [];
      const creatorIds = threadsData?.map((thread) => thread.created_by);

      const requestNumberOfReplies = threadsData?.map((td) => {
        return ThreadReplyService.getTotalThreadRepliesCount({
          forum_id: forumId,
          thread_id: td.thread_id,
        });
      });

      console.log(
        requestNumberOfReplies,
        threadsData,
        forumId,
        threadsResponse
      );

      // Prepare concurrent calls for total replies count and auth users details
      const [totalRepliesCountResponses, allAuthUsersResponse, forumResponse] =
        await Promise.all([
          Promise?.all(requestNumberOfReplies),
          creatorIds.length > 0
            ? AuthService.getAllAuthUsers(
                1,
                creatorIds.length,
                ["fname", "lname", "username", "profile_image", "user_id"],
                { user_id: creatorIds }
              )
            : Promise.resolve({ data: [] }),
          ForumService.getForum({ forum_id: forumId }, []),
        ]);

      const totalRepliesCountData = totalRepliesCountResponses?.map((el) => {
        return el.data ? el.data : el;
      });

      setForum(forumResponse.data ? forumResponse.data : forumResponse);

      // Log the results (or handle them as needed)
      console.log("Total Replies Count:", totalRepliesCountResponses);
      console.log(
        "All Auth Users:",
        allAuthUsersResponse.data,
        typeof allAuthUsersResponse.data
      );

      setTotalReplies((prev) => {
        return [...prev, ...totalRepliesCountData];
      });

      // Map threads data to include creator details
      const threadsWithCreators = threadsData?.map((thread) => {
        const creatorDetails = Array.isArray(allAuthUsersResponse?.data?.data)
          ? allAuthUsersResponse?.data?.data?.find(
              (creator) => creator.user_id === thread.created_by
            )
          : null;
        return {
          ...thread,
          creator: creatorDetails || {}, // Fallback to an empty object if no creator is found
        };
      });

      // Update your state/hooks with the fetched data
      setThreads(threadsWithCreators);
      setTotalPages(threadsResponse.data.totalPages); // Adjust according to your API response structure
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setLoading(false); // Ensure loading state is updated regardless of success/failure
    }
  };

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const maxPageVisible = 5; // You can adjust how many pages you want to show in the pagination bar

  const getPaginationRange = () => {
    const totalNumbers =
      maxPageVisible < totalPages ? maxPageVisible : totalPages;
    const sideNumbers = Math.floor(totalNumbers / 2);
    const startPage = Math.max(currentPage - sideNumbers, 1);
    const endPage = Math.min(startPage + totalNumbers - 1, totalPages);

    let range = [];
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  };

  // This function now just triggers a refresh of the threads
  const handleAddNewThread = () => {
    fetchThreads(currentPage); // Re-fetch threads to include the new addition
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="3x"
          className="text-purple-500"
        />
      </div>
    );
  }

  return (
    <div className="py-4 max-w-7xl mx-auto flex flex-col space-y-6 ">
      {selectedThread === null ? (
        <>
          {(forum?.forum_type !== "noticeboard" ||
            (forum?.forum_type === "noticeboard" &&
              usersAllowed?.includes(user?.user_id))) && (
            <ThreadActionComponent
              forumId={forumId}
              onAddOrUpdateThread={handleAddNewThread}
              forumType={forum?.forum_type}
            />
          )}
          <div className="flex-grow overflow-auto">
            {threads?.map((thread) => (
              <ThreadComponent
                key={thread.thread_id}
                thread={thread}
                setThreads={setThreads}
                onClickThread={(thread_id) => {
                  setSelectedThread(thread_id);
                }}
                totalReplies={
                  totalReplies.find((e) => e.thread_id === thread.thread_id)
                    ?.totalDocuments
                }
                forumType={forum.forum_type}
                usersAllowed={usersAllowed}
              />
            ))}
          </div>
          {threadCount > 0 && (
            <nav className="flex justify-center items-center space-x-1">
              <button
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "cursor-not-allowed text-gray-400"
                    : "text-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              {getPaginationRange()?.map((number, index) => (
                <button
                  key={number}
                  className={`px-3 py-1 rounded-full transition-colors duration-200 ${
                    number === currentPage
                      ? "bg-blue-500 text-white"
                      : "text-blue-500 hover:bg-blue-500 hover:text-white"
                  }`}
                  onClick={() => changePage(number)}
                >
                  {number}
                </button>
              ))}
              {totalPages > maxPageVisible &&
                currentPage < totalPages - sideNumbers && (
                  <>
                    <span>...</span>
                    <button
                      className="px-3 py-1 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white"
                      onClick={() => changePage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              <button
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "cursor-not-allowed text-gray-400"
                    : "text-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </nav>
          )}
        </>
      ) : (
        <>
          <SingleThreadComponent
            thread={threads.find((t) => t.thread_id === selectedThread)}
            onBack={() => setSelectedThread(null)}
            setThreads={setThreads}
            refreshNumberOfReplies={refreshNumberOfReplies}
            numberOfReplies={
              totalReplies.find((e) => e.thread_id === selectedThread)
                ?.totalDocuments
            }
            setSelectedThread={setSelectedThread}
            forumType={forum.forum_type}
            usersAllowed={usersAllowed}
          />
        </>
      )}
    </div>
  );
}

export default Forum;
