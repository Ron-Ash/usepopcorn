import { useState } from "react";
import PropTypes from "prop-types";

TextExpander.propTypes = {
  collapsedNumWords: PropTypes.number,
  defaultPositionOpen: PropTypes.bool,
  expandButtonText: PropTypes.string,
  collapseButtonText: PropTypes.string,
  buttonColor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.string,
};

export default function TextExpander({
  collapsedNumWords = 10,
  defaultPositionOpen = false,
  expandButtonText = "Show More",
  collapseButtonText = "Show less",
  buttonColor = "blue",
  className = "",
  children,
}) {
  const [expanded, setExpanded] = useState(defaultPositionOpen);
  return (
    <p className={className}>
      {children.substring(0, collapsedNumWords)}
      {expanded && children.substring(collapsedNumWords, children.length)}
      <span
        onClick={() => setExpanded((expanded) => !expanded)}
        style={{ cursor: "pointer", color: buttonColor }}
      >
        {expanded ? collapseButtonText : `...${expandButtonText}`}
      </span>
    </p>
  );
}
