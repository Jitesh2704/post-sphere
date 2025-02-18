import axios from "axios";

const API_URL = `${import.meta.env.VITE_REACT_APP_POST_HOST}userPosts/`;
import fetchData from "../../utils/queryBuilder";

const user = JSON.parse(localStorage.getItem('user'))
const getAllUserPosts = async (
  page = 1,
  limit = 10,
  fields = [],
  filterFields = {},
  search = "",
  searchFields = [],
  sortField = '',  // Include sortField with a default value
  sortOrder = 'desc',  // Include sortOrder with a default value 'desc'
) => {
  try {
    const response = await fetchData({
      API_URL,
      endpoint: 'getAllUserPosts',
      options: {
        page,
        limit,
        fields,
        filterFields,
        search,
        searchFields,
        sortField,  // Pass sortField to fetchData
        sortOrder,  // Pass sortOrder to fetchData
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching programs:', error);
    throw error;
  }
};

const getUserPost = (filterFields = {}, fields = []) => {
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

  return axios.get(API_URL + "getUserPost" + queryParams);
};

const createUserPost = (userPostData) => {
  return axios.post(API_URL + "createUserPost", {...userPostData, created_by: user?.user_id} );
};

const updateUserPost = (id, updatedData) => {
  return axios.put(API_URL + "updateUserPost/" + id, {...updatedData, modified_by: user?.user_id} );
};

const deleteUserPost = (id) => {
  return axios.delete(API_URL + "deleteUserPost/" + id + "/"+ user?.user_id);
};

const searchUserPosts = ({
  page = 1,
  limit = 10,
  search = "",
  filters = {},
}) => {
  let queryParams = `?page=${page}&limit=${limit}`;

  if (search) {
    queryParams += `&search=${encodeURIComponent(search)}`;
  }

  if (filters.postType) {
    // Adjusted to 'postType'
    queryParams += `&event_type=${encodeURIComponent(filters.postType)}`; // Adjusted to 'event_type'
  }

  if (Object.keys(filters).length > 0) {
    // Iterate over filters object and append each filter as a query parameter
    Object.entries(filters).forEach(([key, value]) => {
      // Check if value is a Date object or an array of Dates and convert to ISO string
      if (value instanceof Date) {
        queryParams += `&${key}=${value.toISOString()}`;
      } else if (
        Array.isArray(value) &&
        value.every((v) => v instanceof Date)
      ) {
        queryParams += `&${key}=${value.map((v) => v.toISOString()).join(",")}`;
      } else {
        queryParams += `&${key}=${encodeURIComponent(value)}`;
      }
    });
  }

  return axios.get(API_URL + "searchUserPosts" + queryParams);
};

const UserPostsService = {
  getAllUserPosts,
  getUserPost,
  createUserPost,
  updateUserPost,
  deleteUserPost,
  searchUserPosts,
};

export default UserPostsService;

