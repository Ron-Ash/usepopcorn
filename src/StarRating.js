import { useState } from "react";
import PropTypes from "prop-types";

const containerStyle = { display: "flex", alignItems: "center", gap: "16px" };
const starContainerStyle = {
  display: "flex",
};

StarRating.propTypes = {
  onSetRating: PropTypes.func,
  maxRating: PropTypes.number,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.object,
};

export default function StarRating({
  onSetRating = (rate) => {},
  maxRating = 5,
  messages = [],
  defaultRating = 0,
  color = "#fcc419",
  size = 15,
  className = "",
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTemRating] = useState(rating);

  const starStyle = {
    cursor: "pointer",
    fontSize: `${size * 2}px`,
    color: color,
  };
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    fontSize: `${size}px`,
    color: color,
  };
  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span
            role="button"
            style={starStyle}
            key={i + 1}
            onClick={() => {
              setRating(rating === i + 1 ? defaultRating : i + 1);
              onSetRating(rating);
            }}
            onMouseEnter={() => setTemRating(i + 1)}
            onMouseLeave={() => setTemRating(rating)}
          >
            {i + 1 > tempRating ? "☆" : "★"}
          </span>
        ))}
      </div>
      <p style={textStyle}>
        {(messages.length === maxRating
          ? messages[tempRating - 1]
          : tempRating) || ""}
      </p>
    </div>
  );
}
