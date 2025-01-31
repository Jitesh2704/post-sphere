import React from "react";
import styled from "styled-components";

const CountButton = ({ isLiked, count, onClick }) => {
  return (
    <StyledWrapper>
      <button className="Btn" onClick={onClick}>
        <span className="leftContainer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            fill="#fff"
          >
            <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
          </svg>
          <span className="like">{isLiked ? "Liked" : "Like"}</span>
        </span>
        <span className="likeCount">{count}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .Btn {
    width: 140px;
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
    background-color: #0060ff;
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
    color: #0060ff;
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
    background-color: #1d4292;
  }

  .Btn:active .leftContainer {
    background-color: #072b7a;
  }

  .Btn:active .leftContainer svg {
    transform: scale(1.15);
    transform-origin: top;
  }
`;

export default CountButton;
