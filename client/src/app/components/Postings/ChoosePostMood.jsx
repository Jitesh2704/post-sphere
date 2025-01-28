import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import SystemPreferencesService from "../../services/user-service/system-preferences.service";
import UserPreferencesService from "../../services/user-service/user-preferences.service";
import UserSettingsService from "../../services/user-service/user-settings.service";
import { getImageUrl } from "../../utils/getUrl";

const ChoosePostMood = ({ handleContinue }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.user_id;

  const toggleOption = (preference_id) => {
    const newSelectedOptions = selectedOptions.includes(preference_id)
      ? selectedOptions.filter((optionId) => optionId !== preference_id)
      : [...selectedOptions, preference_id];
    setSelectedOptions(newSelectedOptions);
  };

  const isOptionSelected = (preference_id) => {
    return selectedOptions.includes(preference_id);
  };

  const handleUpdateSettings = async () => {
    try {
      const res = await UserSettingsService.getUserSetting({ user_id: userId });
      console.log(res.data.user_setting_id);
      const settingId = res.data.user_setting_id;
      const updatedSettings = await UserSettingsService.updateUserSetting(
        settingId,
        {
          other_onboarding_statuses: {
            ...res.data.other_onboarding_statuses,
            posting_onboarding: true,
          },
        }
      );
      console.log(updatedSettings.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleContinueClick = async () => {
    try {
      const promises = selectedOptions.map((preferenceId) => {
        return UserPreferencesService.createUserPreference({
          user_id: userId,
          preference_type: "Postings",
          preference_id: preferenceId,
        });
      });

      await Promise.all(promises);

      // Wait for handleUpdateSettings to complete
      await handleUpdateSettings();
      
      //  if (promises.length > 0) {
      //    // Wait for all promises to be fulfilled
      //    await Promise.all(promises);
      //    // After promises are fulfilled, call handleUpdateSettings
      //    await handleUpdateSettings();
      //  }

      // After handleUpdateSettings is successful, call handleContinue
      handleContinue();
    } catch (error) {
      // Handle errors if any
      console.error("Error creating user preferences:", error);
    }
  };


  const fetchOptions = async () => {
    try {
      const response = await SystemPreferencesService.getAllSystemPreferences(
        1,
        1000,
        [],
        {
          preference_type: "Postings",
          preference_phase: "Awakening Phase",
        }
      );
      if (response.data) {
        setOptions(response.data);
      } else {
        console.error("options not found.");
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <div className="w-full bg-white px-4 md:px-12 lg:px-28 py-12">
      <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center font-semibold">
        What do you wanna post today?
      </div>
      <div className="ml-4 md:ml-32 text-center w-64 md:w-64 h-4 -mt-1 bg-sky-400 opacity-50"></div>

      <div className="grid grid-cols-12 gap-6 mt-20">
        {options.map((option) => (
          <div
            key={option.preference_id}
            className={`relative col-span-12 md:col-span-6 p-4 border-2 rounded-lg shadow-lg flex items-center justify-between cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              isOptionSelected(option.preference_id)
                ? "border-blue-500 bg-blue-100"
                : "border-gray-200"
            }`}
            onClick={() => toggleOption(option.preference_id)}
          >
            <img
              src={getImageUrl(option.preference_image)}
              alt={option.preference_name}
              className="w-16 h-16 mr-5"
            />
            <span
              className={`flex-1 text-xs lg:text-lg font-semibold ${
                isOptionSelected(option.preference_id)
                  ? "text-blue-900"
                  : "text-gray-800"
              }`}
            >
              {option.preference_name}
            </span>
            {isOptionSelected(option.preference_id) && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
                <FaCheck className="text-blue-500 text-2xl" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-16">
        <button
          className="rounded-full bg-blue-600 text-white px-6 text-lg py-3 transition-all duration-300 transform hover:scale-125"
          onClick={handleContinueClick}
        >
          Continue{" "}
          <FontAwesomeIcon icon={faArrowRightLong} className="ml-2 text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ChoosePostMood;
