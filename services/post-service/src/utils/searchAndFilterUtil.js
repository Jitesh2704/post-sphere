const mongoose = require("mongoose");

const searchAndFilter = async (Model, req) => {
  try {
    const { page = 1, limit = 10, search = "", ...filters } = req.query;
    let query = [];
    let matchStage = {};

    // Dynamically identify date fields
    const dateFields = Object.keys(Model.schema.paths).filter(
      (key) => Model.schema.paths[key].instance === "Date"
    );

    // Keyword Search
    if (search) {
      const searchConditions = Object.keys(Model.schema.paths)
        .filter((key) => !["_id", "__v", ...dateFields].includes(key))
        .map((key) => ({
          [key]: { $regex: search, $options: "i" },
        }));
      if (searchConditions.length > 0) {
        matchStage.$or = searchConditions;
      }
    }

    if (Object.keys(matchStage).length) {
      query.push({ $match: matchStage });
    }

    let filterConditions = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (dateFields.includes(key)) {
        const dateValue = filters[key];
        let dateFilter = {};
        if (dateValue.includes(",")) {
          const [startDate, endDate] = dateValue.split(",");
          dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else {
          let startDate = new Date(dateValue);
          startDate.setUTCHours(0, 0, 0, 0);
          let endDate = new Date(dateValue);
          endDate.setUTCHours(23, 59, 59, 999);
          dateFilter = { $gte: startDate, $lte: endDate };
        }
        query.push({ $match: { [key]: dateFilter } });
      } else if (Object.keys(Model.schema.paths).includes(key)) {
        filterConditions[key] =
          Model.schema.paths[key].instance === "String"
            ? { $regex: value, $options: "i" }
            : value;
      }
    });

    if (Object.keys(filterConditions).length) {
      query.push({ $match: filterConditions });
    }

    const results = await Model.aggregate([
      ...query,
      { $skip: (page - 1) * Number(limit) },
      { $limit: Number(limit) },
    ]);

    const totalCountResult = await Model.aggregate([
      ...query,
      { $count: "total" },
    ]);

    const totalCount =
      totalCountResult.length > 0 ? totalCountResult[0].total : 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: results,
      pagination: {
        totalPages,
        currentPage: page,
        limit,
        totalItems: totalCount,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal server error" };
  }
};

module.exports = searchAndFilter;
