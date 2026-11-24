import client from "../../api/axiosInstance";
export const admissionApi = {
  listCategories: async () =>
    (await client.get("/api/admin/admission-categories/all")).data.categories ||
    [],
  createCategory: (payload) =>
    client.post("/api/admin/admission-categories/create", payload),
  updateCategory: (payload) =>
    client.patch("/api/admin/admission-categories/update", payload),
  deleteCategory: (categoryId) =>
    client.delete("/api/admin/admission-categories/delete", {
      data: { categoryId },
    }),
  list: async (params) => {
    const { data } = await client.get("/api/admin/admissions/all", { params });
    return { rows: data.admissions || [], total: data.total || 0 };
  },
  get: async (id) =>
    (await client.get(`/api/admin/admissions/${encodeURIComponent(id)}`)).data
      .admission,
  create: (payload) => client.post("/api/admin/admissions/create", payload),
  update: (payload) => client.patch("/api/admin/admissions/update", payload),
  remove: (admissionId) =>
    client.delete("/api/admin/admissions/delete", { data: { admissionId } }),
};
