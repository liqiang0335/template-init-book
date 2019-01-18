import React from "react";
import "./Browser.scss";

export default function Browser(props) {
  return (
    <aside className="Browser">
      <div className="header">
        <i />
        <i />
        <i />
      </div>
      <div className="output">{props.children}</div>
    </aside>
  );
}
