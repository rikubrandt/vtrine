import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fetchDisplays from "../lib/fetchDisplays";
import GridSlider from "./GridSlider";

const ProfileComponentBuilder = ({ userId }) => {
  const router = useRouter();
  const [displays, setDisplays] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchDisplays(userId).then(setDisplays);
    }
    console.log(displays);
  }, [userId]);

  const renderDisplay = (display) => {
    console.log(display);
    if (display.designType === "slider") {
      return <GridSlider key={display.id} posts={display.selectedPosts} />;
    }
    return null;
  };

  return (
    <div className="profile-page container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="displays-grid grid grid-cols-1 gap-4">
        {displays.map(renderDisplay)}
      </div>
    </div>
  );
};

export default ProfileComponentBuilder;
