import client from "../../api/axiosInstance";
export const scholarshipApi = {
  listCategories: async () =>
    (await client.get("/api/admin/categories/all")).data.data || [],
  createCategory: (payload) =>
    client.post("/api/admin/categories/create", payload),
  updateCategory: (payload) =>
    client.patch("/api/admin/categories/update", payload),
  deleteCategory: (scholarshipType) =>
    client.delete("/api/admin/categories/delete", {
      data: { scholarshipType },
    }),
  list: async (params) =>
    (await client.get("/api/admin/scholarships/all", { params })).data.data ||
    [],
  get: async (id) =>
    (await client.get(`/api/admin/scholarships/${encodeURIComponent(id)}`)).data
      .data,
  create: (payload) => client.post("/api/admin/scholarships/create", payload),
  update: (payload) => client.patch("/api/admin/scholarships/update", payload),
  remove: (scholarshipCategoryId) =>
    client.delete("/api/admin/scholarships/delete", {
      data: { scholarshipCategoryId },
    }),
};
