import client from "../../api/axiosInstance";

export const config = {
  title: "College Selection",
  list: "/api/college-selection/admin/all",
  create: "/api/college-selection/create",
  update: "/api/college-selection/update",
  remove: "/api/college-selection/delete",
  key: "itemId",
  array: "items",
  fields: [
    "title",
    "description",
    "tag",
    "city",
    "state",
    "feesMin",
    "feesMax",
    "rating",
    "videoUrl",
  ],
  required: ["title", "description", "city", "state"],
  targets: true,
  lists: ["courses", "keyPoints"],
  video: true,
};

export async function list(page = 1) {
  const { data } = await client.get(config.list, {
    params: config.nested ? {} : { page, limit: 20 },
  });
  return {
    rows: data[config.array] || data.data || [],
    total: data.total ?? data.count ?? (data[config.array] || []).length,
  };
}
async function mutate(mode, payload) {
  const method =
    mode === "create"
      ? "post"
      : mode === "update"
        ? config.updateMethod || "put"
        : "delete";
  const url =
    mode === "create"
      ? config.create
      : mode === "update"
        ? config.update
        : config.remove;
  return client({ method, url, data: payload });
}
export function makePayload(data, file) {
  if (!file) return data;
  const fd = new FormData();
  const append = (key, value) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((v, i) => append(`${key}[${i}]`, v));
    } else if (typeof value === "object") {
      Object.entries(value).forEach(([k, v]) => append(`${key}[${k}]`, v));
    } else fd.append(key, String(value));
  };
  Object.entries(data).forEach(([k, v]) => append(k, v));
  fd.append(config.image ? "image" : "video", file);
  return fd;
}

export async function get(id) {
  const { data } = await client.post("/api/college-selection/admin/get", {
    [config.key]: id,
  });
  return (
    data.college ||
    data.item ||
    data.course ||
    data.college ||
    data.data ||
    null
  );
}

export const create = (data) => mutate("create", data);
export const update = (data) => mutate("update", data);
export const remove = (id) => mutate("delete", { [config.key]: id });
