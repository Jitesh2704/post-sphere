import React, { useState, useEffect } from "react";
import ChoosePostMood from "../../components/Postings/ChoosePostMood";
import LandingCover from "../../components/Postings/LandingCover";
import Posts from "../../components/Postings/Posts";
import { useSelector } from "react-redux";
import UserSettingsService from "../../services/user-service/user-settings.service";

export default function Postings() {
  const [showPostingMood, setShowPostingMood] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;

  // Function to fetch user settings
  const fetchData = async (userId) => {
    try {
      const res = await UserSettingsService.getUserSetting({
        user_id: userId,
      });

      const showBool = res.data.other_onboarding_statuses.posting_onboarding;
      setShowPostingMood(!showBool); // Show if posting_onboarding is false
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Fetch user settings when userId changes
  useEffect(() => {
    fetchData(userId);
  }, [userId]); // Fetch data when userId changes

  const handleContinue = async () => {
    try {
      await fetchData(userId);
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  };

  return (
    <div className="grid grid-cols-12">
      <div className="hidden md:block col-span-2 bg-gray-500"></div>
      <div className="col-span-12 md:col-span-10 flex flex-col">
        <LandingCover />
        {showPostingMood ? (
          <ChoosePostMood handleContinue={handleContinue} />
        ) : (
          <>
            <Posts />
          </>
        )}
      </div>
    </div>
  );
}
