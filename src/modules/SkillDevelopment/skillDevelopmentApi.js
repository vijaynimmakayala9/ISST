import client from "../../api/axiosInstance";

export const config = {
  title: "Skill Development",
  list: "/api/skill-development-courses/admin/all",
  create: "/api/skill-development-courses/create",
  update: "/api/skill-development-courses/update",
  remove: "/api/skill-development-courses/delete",
  key: "courseId",
  array: "courses",
  fields: [
    "title",
    "description",
    "courseCategory",
    "courseLevel",
    "courseType",
    "duration",
    "videoUrl",
  ],
  required: [
    "title",
    "description",
    "courseCategory",
    "courseLevel",
    "courseType",
    "duration",
  ],
  targets: true,
  lists: ["whatYouWillLearn", "keyPoints"],
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
  const { data } = await client.post(
    "/api/skill-development-courses/admin/get",
    { [config.key]: id },
  );
  return (
    data.course || data.item || data.course || data.college || data.data || null
  );
}

export const create = (data) => mutate("create", data);
export const update = (data) => mutate("update", data);
export const remove = (id) => mutate("delete", { [config.key]: id });
