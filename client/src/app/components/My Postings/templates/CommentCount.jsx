import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ForumThreadService from "../../../services/forum-service/forum-thread.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

const CommentCount = ({ forumId, onClick }) => {
  const [count, setCount] = useState("0");

  useEffect(() => {
    const countFetch = async () => {
      try {
        const res = await ForumThreadService.getAllForumThreads(
          1,
          -1,
          ["thread_id"],
          { forum_id: forumId }
        );
        setCount(res.data.length);
      } catch (error) {
        console.error("Error fetching thread count:", error);
      }
    };

    countFetch();
  }, [forumId]);

  return (
    <StyledWrapper>
      <button className="Btn" onClick={onClick}>
        <span className="leftContainer">
          <FontAwesomeIcon icon={faComment} className="" />

          <span className="like">Comments</span>
        </span>
        <span className="likeCount">{count || 0}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .Btn {
    width: 200px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: none;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.089);
    cursor: pointer;
    background-color: transparent;
  }

  .leftContainer {
    width: 60%;
    height: 100%;
    background-color: rgb(238, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .leftContainer .like {
    color: white;
    font-weight: 600;
  }

  .likeCount {
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgb(238, 0, 0);
    font-weight: 600;
    position: relative;
    background-color: white;
  }

  .likeCount::before {
    height: 8px;
    width: 8px;
    position: absolute;
    content: "";
    background-color: rgb(255, 255, 255);
    transform: rotate(45deg);
    left: -4px;
  }

  .Btn:hover .leftContainer {
    background-color: rgb(219, 0, 0);
  }

  .Btn:active .leftContainer {
    background-color: rgb(201, 0, 0);
  }

  .Btn:active .leftContainer svg {
    transform: scale(1.15);
    transform-origin: top;
  }
`;

export default CommentCount;
