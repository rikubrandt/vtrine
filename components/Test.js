import { firebase } from "../lib/firebase";
import React, { useEffect } from "react";
import CoverFlowSlider from "./CoverFlowSlider";

function Test({ images }) {
  return (
    <div>
      <CoverFlowSlider images={images} />
    </div>
  );
}

export default Test;
