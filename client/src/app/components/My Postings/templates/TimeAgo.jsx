import React from "react";
import moment from "moment";

const TimeAgo = ({ date }) => {
  const parsedDate = new Date(date);
  const currentDate = moment();
  const timeDifference = moment.duration(currentDate.diff(parsedDate));

  let formattedDate;

  if (timeDifference.as("minutes") < 60) {
    // Less than an hour, show relative time in minutes
    formattedDate = moment(parsedDate).fromNow();
  } else if (timeDifference.as("hours") < 24 * 30) {
    // Less than 30 days, show relative time in hours
    formattedDate = moment(parsedDate).fromNow();
  } else if (
    timeDifference.as("days") > 30 &&
    timeDifference.as("days") < 365
  ) {
    // More than 30 days, show date and month
    formattedDate = moment(parsedDate).format("MMM D");
  } else {
    // More than a year, show year and month
    formattedDate = moment(parsedDate).format("YYYY MMM");
  }

  return <span title={date}>Created {formattedDate}</span>;
};

export default TimeAgo;
