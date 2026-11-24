import client from "../../api/axiosInstance";
export const entranceExamApi = {
  listCategories: async () =>
    (await client.get("/api/admin/exam-categories/all")).data.categories || [],
  createCategory: (payload) =>
    client.post("/api/admin/exam-categories/create", payload),
  updateCategory: (payload) =>
    client.patch("/api/admin/exam-categories/update", payload),
  deleteCategory: (categoryId) =>
    client.delete("/api/admin/exam-categories/delete", {
      data: { categoryId },
    }),
  list: async (params) => {
    const { data } = await client.get("/api/admin/exams/all", { params });
    return { rows: data.exams || [], total: data.total || 0 };
  },
  get: async (id) =>
    (await client.get(`/api/admin/exams/${encodeURIComponent(id)}`)).data.exam,
  create: (payload) => client.post("/api/admin/exams/create", payload),
  update: (payload) => client.patch("/api/admin/exams/update", payload),
  remove: (examId) =>
    client.delete("/api/admin/exams/delete", { data: { examId } }),
};
