import client from "../../api/axiosInstance";

export const config = {
  title: "Education Levels",
  list: "/api/education-levels/admin",
  create: "/api/education-levels",
  update: "/api/education-levels",
  remove: "/api/education-levels",
  updateMethod: "patch",
  key: "levelId",
  array: "levels",
  fields: ["name"],
  required: ["name"],
  nested: true,
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
export const mutateNested = (path, method, data) =>
  client({ url: "/api/education-levels/" + path, method, data });

export const create = (data) => mutate("create", data);
export const update = (data) => mutate("update", data);
export const remove = (id) => mutate("delete", { [config.key]: id });
