import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";
// import TextExpander from "./TextExpander";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10}></StarRating>
    <StarRating
      messages={["horrible", "bad", "ok", "good", "great"]}
      defaultRating={3}
    ></StarRating>
    <TextExpander>
      The "Masters of Rome" series by Colleen McCullough is a set of historical
      novels that chronicle the final decades of the Roman Republic. Spanning
      from the rise of Gaius Marius to the fall of Julius Caesar, the series
      explores the intricate political, military, and personal dramas of Rome's
      most powerful figures. McCullough meticulously blends historical accuracy
      with compelling narratives, bringing to life key figures like Marius,
      Sulla, Pompey, and Caesar. Through detailed depictions of battles,
      political maneuvering, and personal ambitions, the series provides a vivid
      portrait of Rome's transformation from a republic to an empire.
    </TextExpander> */}
  </React.StrictMode>
);
