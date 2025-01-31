import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { setSelectedMenu } from "../slices/menuSlice";

function HeaderItem({ name, Icon }) {
  const dispatch = useDispatch();

  const singularName =
    name === "STORIES"
      ? "story"
      : name.toLowerCase().endsWith("s")
      ? name.slice(0, -1)
      : name.toLowerCase();

  return (
    <div
      className="text-white flex items-center gap-3 text-[15px] tracking-lose cursor-pointer hover:underline underline-offset-8"
      onClick={() => dispatch(setSelectedMenu(singularName.toLowerCase()))}
    >
      <FontAwesomeIcon icon={Icon} />
      <h2 className="">{name}</h2>
    </div>
  );
}

export default HeaderItem;
