import axios from "axios";

const API_URL = `${import.meta.env.VITE_REACT_APP_HOST}forum/replies/`;
// const API_URL = "api.upmymind.in/api/forum/replies/";
import fetchData from "../../utils/queryBuilder";

const user = JSON.parse(localStorage.getItem("user"));
const getAllThreadReplies = async (
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
      endpoint: "getAllThreadReplies",
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

const getThreadReply = (filterFields = {}, fields = []) => {
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

  return axios.get(API_URL + "getThreadReply" + queryParams);
};

const createThreadReply = (replyData) => {
  return axios.post(API_URL + "createThreadReply", {
    ...replyData,
    created_by: user?.user_id,
  });
};

const updateThreadReply = (id, updatedData) => {
  return axios.put(API_URL + "updateThreadReply/" + id, {
    ...updatedData,
    modified_by: user?.user_id,
  });
};

const deleteThreadReply = (id) => {
  return axios.delete(
    API_URL + "deleteThreadReply/" + id + "/" + user?.user_id
  );
};

const getTotalThreadRepliesCount = (filterFields = {}) => {
  let queryParams = "";

  if (Object.keys(filterFields).length > 0) {
    queryParams += `?filterFields=${encodeURIComponent(
      JSON.stringify(filterFields)
    )}`;
  }

  return axios.get(API_URL + "getNumberOfReplies" + queryParams);
};

const ThreadReplyService = {
  getAllThreadReplies,
  getThreadReply,
  createThreadReply,
  updateThreadReply,
  deleteThreadReply,
  getTotalThreadRepliesCount,
};

export default ThreadReplyService;
