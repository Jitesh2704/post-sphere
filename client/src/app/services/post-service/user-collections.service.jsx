import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_REACT_APP_POST_HOST
}userCollections/`;

import fetchData from "../../utils/queryBuilder";

const user = JSON.parse(localStorage.getItem('user'))
const getAllUserCollections = async (
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
      endpoint: 'getAllUserCollections',
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

const getUserCollection = (filterFields = {}, fields = []) => {
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

  return axios.get(API_URL + "getUserCollection" + queryParams);
};

const createUserCollection = (userCollectionData) => {
  return axios.post(API_URL + "createUserCollection", {...userCollectionData, created_by: user?.user_id} );
};

const updateUserCollection = (id, updatedData) => {
  return axios.put(API_URL + "updateUserCollection/" + id, {...updatedData, modified_by: user?.user_id} );
};

const deleteUserCollection = (id) => {
  return axios.delete(API_URL + "deleteUserCollection/"+ id + "/"+ user?.user_id);
};

const searchUserCollections = ({ page = 1, limit = 10, search = "", filters = {} }) => {
  let queryParams = `?page=${page}&limit=${limit}`;

  if (search) {
    queryParams += `&search=${encodeURIComponent(search)}`;
  }

  if (filters.postType) {
    // Adjusted to 'postType'
   queryParams += `&post_type=${encodeURIComponent(filters.postType)}`;
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

  return axios.get(API_URL + "searchUserCollections" + queryParams);
};

const UserCollectionsService = {
  getAllUserCollections,
  getUserCollection,
  createUserCollection,
  updateUserCollection,
  deleteUserCollection,
  searchUserCollections,
};

export default UserCollectionsService;
