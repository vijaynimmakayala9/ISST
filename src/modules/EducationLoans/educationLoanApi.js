import client from "../../api/axiosInstance";
export const educationLoanApi = {
  listCategories: async () =>
    (await client.get("/api/admin/loan-categories/all")).data.categories || [],
  createCategory: (payload) =>
    client.post("/api/admin/loan-categories/create", payload),
  updateCategory: (payload) =>
    client.patch("/api/admin/loan-categories/update", payload),
  deleteCategory: (categoryId) =>
    client.delete("/api/admin/loan-categories/delete", {
      data: { categoryId },
    }),
  list: async (params) => {
    const { data } = await client.get("/api/admin/loans/all", { params });
    return { rows: data.loans || [], total: data.total || 0 };
  },
  get: async (id) =>
    (await client.get(`/api/admin/loans/${encodeURIComponent(id)}`)).data.loan,
  create: (payload) => client.post("/api/admin/loans/create", payload),
  update: (payload) => client.patch("/api/admin/loans/update", payload),
  remove: (loanId) =>
    client.delete("/api/admin/loans/delete", { data: { loanId } }),
};
