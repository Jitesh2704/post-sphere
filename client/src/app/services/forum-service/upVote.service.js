import axios from "axios";
const API_URL = `${import.meta.env.VITE_REACT_FORUM_HOST}forum/upvotes/`;
// const API_URL = "api.upmymind.in/api/forum/upVotes/";
import fetchData from "../../utils/queryBuilder";

const user = JSON.parse(localStorage.getItem("user"));

const getAllUpvotes = async (
  page = 1,
  limit = 10,
  fields = [],
  filterFields = {},
  search = "",
  searchFields = [],
  sortField = "", // Include sortField with a default value
  sortOrder = "desc" // Include sortOrder with a default value 'desc'
) => {
  try {
    const response = await fetchData({
      API_URL,
      endpoint: "getAllUpvotes",
      options: {
        page,
        limit,
        fields,
        filterFields,
        search,
        searchFields,
        sortField, // Pass sortField to fetchData
        sortOrder, // Pass sortOrder to fetchData
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching programs:", error);
    throw error;
  }
};

const getUpvote = (filterFields = {}, fields = []) => {
  let queryParams = "";

  if (fields.length > 0) {
    queryParams += `?fields=${fields.join(",")}`;
  }

  if (Object.keys(filterFields).length > 0) {
    const filterParam = `filterFields=${encodeURIComponent(
      JSON.stringify(filterFields)
    )}`;
    queryParams +=
      queryParams.length > 0 ? `&${filterParam}` : `?${filterParam}`;
  }

  return axios.get(API_URL + "getUpvote" + queryParams);
};

const createUpvote = (upvoteData) => {
  return axios.post(API_URL + "createUpvote", {
    ...upvoteData,
    created_by: user?.user_id,
  });
};

const updateUpvote = (id, updatedData) => {
  return axios.put(API_URL + "updateUpvote/" + id, {
    ...updatedData,
    modified_by: user?.user_id,
  });
};

const deleteUpvote = (id) => {
  return axios.delete(API_URL + "deleteUpvote/" + id + "/" + user?.user_id);
};

const UpvoteService = {
  getAllUpvotes,
  getUpvote,
  createUpvote,
  updateUpvote,
  deleteUpvote,
};

export default UpvoteService;
