import client from "../../api/axiosInstance";
export const placementTrainingApi = {
  listCategories: async () =>
    (await client.get("/api/admin/placement-categories/all")).data.categories ||
    [],
  createCategory: (payload) =>
    client.post("/api/admin/placement-categories/create", payload),
  updateCategory: (payload) =>
    client.patch("/api/admin/placement-categories/update", payload),
  deleteCategory: (categoryId) =>
    client.delete("/api/admin/placement-categories/delete", {
      data: { categoryId },
    }),
  list: async (params) => {
    const { data } = await client.get("/api/admin/placement-trainings/all", {
      params,
    });
    return { rows: data.trainings || [], total: data.total || 0 };
  },
  get: async (id) =>
    (
      await client.get(
        `/api/admin/placement-trainings/${encodeURIComponent(id)}`,
      )
    ).data.training,
  create: (payload, file) =>
    client.post(
      "/api/admin/placement-trainings/create",
      trainingPayload(payload, file),
    ),
  update: (payload, file) =>
    client.patch(
      "/api/admin/placement-trainings/update",
      trainingPayload(payload, file),
    ),
  remove: (trainingId) =>
    client.delete("/api/admin/placement-trainings/delete", {
      data: { trainingId },
    }),
};

function trainingPayload(data, file) {
  if (!file) return data;
  const form = new FormData();
  const append = (key, value) => {
    if (Array.isArray(value)) {
      if (!value.length) form.append(key, "[]");
      value.forEach((entry, index) => append(`${key}[${index}]`, entry));
    } else if (value && typeof value === "object") {
      Object.entries(value).forEach(([field, entry]) =>
        append(`${key}[${field}]`, entry),
      );
    } else {
      form.append(key, value ?? "");
    }
  };
  Object.entries(data).forEach(([key, value]) => append(key, value));
  form.append("video", file);
  return form;
}
