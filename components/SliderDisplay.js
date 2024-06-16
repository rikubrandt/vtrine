import React, { useState, useEffect } from "react";
import { firestore } from "../lib/firebase";
import GridSlider from "./GridSlider";

const SliderDisplay = ({ userId }) => {
  const [displays, setDisplays] = useState([]);
  useEffect(() => {
    const fetchDisplays = async () => {
      const querySnapshot = await firestore
        .collection(`users/${userId}/displays`)
        .get();

      const allDisplays = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const sliderDisplays = allDisplays.filter(
        (display) => display.designType === "slider"
      );
      setDisplays(sliderDisplays);
      console.log(sliderDisplays);
    };

    fetchDisplays();
  }, [userId]);

  return (
    <div>
      {displays.map((display) => (
        <GridSlider key={display.id} posts={display.selectedPosts} />
      ))}
    </div>
  );
};

export default SliderDisplay;
