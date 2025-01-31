import React from "react";
import styled from "styled-components";

const RubicsLoader = () => {
  return (
    <StyledWrapper>
      <div className="my-loader">
        <div className="rubiks-cube">
          <div className="face front">
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ffffff" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
          </div>
          <div className="face back">
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ffffff" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
          </div>
          <div className="face left">
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#ffffff" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
          </div>
          <div className="face right">
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ffffff" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
          </div>
          <div className="face top">
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#ffffff" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
          </div>
          <div className="face bottom">
            <div style={{ background: "#ffffff" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
            <div style={{ background: "#ffeb3b" }} className="cube" />
            <div style={{ background: "#4caf50" }} className="cube" />
            <div style={{ background: "#2196f3" }} className="cube" />
            <div style={{ background: "#ffffff" }} className="cube" />
            <div style={{ background: "#ff3d00" }} className="cube" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .my-loader {
    width: 200px;
    height: 200px;
    perspective: 1000px;
    margin: 100px auto;
  }

  .rubiks-cube {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    animation: my-rotateCube 5s infinite linear;
  }

  .my-loader .face {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
  }

  .my-loader .face.front {
    transform: translateZ(100px);
  }
  .my-loader .face.back {
    transform: rotateY(180deg) translateZ(100px);
  }
  .my-loader .face.left {
    transform: rotateY(-90deg) translateZ(100px);
  }
  .my-loader .face.right {
    transform: rotateY(90deg) translateZ(100px);
  }
  .my-loader .face.top {
    transform: rotateX(90deg) translateZ(100px);
  }
  .my-loader .face.bottom {
    transform: rotateX(-90deg) translateZ(100px);
  }

  .my-loader .cube {
    width: calc(100% / 3);
    height: calc(100% / 3);
    box-sizing: border-box;
    border: 1px solid #000;
  }

  @keyframes my-rotateCube {
    0% {
      transform: rotateX(0deg) rotateY(0deg);
    }
    100% {
      transform: rotateX(360deg) rotateY(360deg);
    }
  }
`;

export default RubicsLoader;
