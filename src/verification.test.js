import React, { act } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import App from "./App";
import client from "./api/axiosInstance";
import { entranceExamApi } from "./modules/EntranceExam/entranceExamApi";
import { educationLoanApi } from "./modules/EducationLoans/educationLoanApi";
import { admissionApi } from "./modules/Admissions/admissionApi";
import { placementTrainingApi } from "./modules/PlacementTrainings/placementTrainingApi";

jest.mock("axios", () => {
  const client = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  };
  return { create: () => client, post: jest.fn() };
});

const [, responseFailure] = client.interceptors.response.use.mock.calls[0];

const id = "6b04d1c2d3e4f5a6b7c8d9b1";
const categoryId = "6b04d1c2d3e4f5a6b7c8d9a0";
const category = {
  _id: categoryId,
  title: "Sample category",
  description: "Category description",
};
const levels = [
  {
    _id: id,
    name: "Degree",
    courses: [{ name: "Engineering", branches: [{ name: "CSE" }] }],
  },
];
const training = {
  _id: id,
  categoryId,
  title: "Training example",
  description: "Description",
  tag: "Placement",
  body: "Article",
  videoUrl: "https://example.com/video.mp4",
  targets: [],
  keyPoints: ["Practice"],
  steps: ["Prepare"],
};
let container, root;
global.IS_REACT_ACT_ENVIRONMENT = true;
jest.spyOn(console, "warn").mockImplementation(() => {});
const session = () => {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return {
    token: `header.${btoa(JSON.stringify({ exp }))}.signature`,
    expiresAt: exp * 1000,
    admin: { name: "Test Admin" },
  };
};
const click = async (text, scope = container) => {
  const node = [...scope.querySelectorAll("button, a")].find(
    (el) =>
      el.textContent.trim() === text || el.getAttribute("aria-label") === text,
  );
  expect(node).toBeDefined();
  await act(async () => node.click());
};
const field = (label, scope = container) =>
  [...scope.querySelectorAll("label")]
    .find((el) => el.textContent.trim().startsWith(label))
    ?.querySelector("input, select, textarea");
const fill = async (node, value) => {
  expect(node).toBeDefined();
  const proto =
    node.tagName === "SELECT"
      ? HTMLSelectElement.prototype
      : node.tagName === "TEXTAREA"
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(node, value);
  await act(async () =>
    node.dispatchEvent(
      new Event(node.tagName === "SELECT" ? "change" : "input", {
        bubbles: true,
      }),
    ),
  );
};
const mount = async (path, loggedIn = true) => {
  if (loggedIn)
    sessionStorage.setItem("isst_admin_session", JSON.stringify(session()));
  window.history.replaceState({}, "", "/admin/" + path);
  await act(async () => root.render(<App />));
};
beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  client.get.mockImplementation(async (path) => {
    if (path === "/api/education-levels/admin") return { data: { levels } };
    if (path.includes("-categories/all"))
      return { data: { categories: [category] } };
    if (path === "/api/admin/placement-trainings/all")
      return { data: { trainings: [training], total: 25 } };
    if (path === `/api/admin/placement-trainings/${id}`)
      return { data: { training } };
    if (path.endsWith("/loans/all")) return { data: { loans: [], total: 9 } };
    return { data: {} };
  });
  for (const verb of ["post", "patch", "delete"])
    client[verb].mockResolvedValue({ data: { success: true } });
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

test.each([
  [entranceExamApi, "exam", "exams", "examId"],
  [educationLoanApi, "loan", "loans", "loanId"],
  [admissionApi, "admission", "admissions", "admissionId"],
  [placementTrainingApi, "placement", "placement-trainings", "trainingId"],
])(
  "documented CRUD paths and wire keys for %s",
  async (api, entity, route, idKey) => {
    const recordKey = entity === "placement" ? "training" : entity;
    client.get.mockImplementation(async (url) => ({
      data: {
        categories: [category],
        [recordKey]: training,
        [recordKey + "s"]: [training],
        total: 21,
      },
    }));
    expect(await api.listCategories()).toEqual([category]);
    await api.createCategory(category);
    await api.updateCategory({ categoryId, title: "Renamed" });
    await api.deleteCategory(categoryId);
    expect(await api.list({ page: 2, q: "example", categoryId })).toEqual({
      rows: [training],
      total: 21,
    });
    expect(await api.get(id)).toEqual(training);
    await api.create({ categoryId, targets: [] });
    await api.update({ [idKey]: id });
    await api.remove(id);
    const prefix = "/api/admin/";
    const categories = prefix + entity + "-categories";
    const records = prefix + route;
    expect(client.get).toHaveBeenCalledWith(categories + "/all");
    expect(client.post).toHaveBeenCalledWith(categories + "/create", category);
    expect(client.patch).toHaveBeenCalledWith(categories + "/update", {
      categoryId,
      title: "Renamed",
    });
    expect(client.delete).toHaveBeenCalledWith(categories + "/delete", {
      data: { categoryId },
    });
    expect(client.get).toHaveBeenCalledWith(records + "/all", {
      params: { page: 2, q: "example", categoryId },
    });
    expect(client.get).toHaveBeenCalledWith(records + "/" + id);
    expect(client.post).toHaveBeenCalledWith(records + "/create", {
      categoryId,
      targets: [],
    });
    expect(client.patch).toHaveBeenCalledWith(records + "/update", {
      [idKey]: id,
    });
    expect(client.delete).toHaveBeenCalledWith(records + "/delete", {
      data: { [idKey]: id },
    });
  },
);

test("serializes Placement multipart arrays, optional targets and final video", async () => {
  const file = new File(["video"], "sample.mp4", { type: "video/mp4" });
  await placementTrainingApi.create(
    {
      categoryId,
      targets: [{ level: "Degree", course: "Engineering" }],
      keyPoints: ["Practice"],
      steps: [],
    },
    file,
  );
  const form = client.post.mock.calls[0][1];
  expect(form).toBeInstanceOf(FormData);
  expect(form.get("targets[0][level]")).toBe("Degree");
  expect(form.get("targets[0][course]")).toBe("Engineering");
  expect(form.get("keyPoints[0]")).toBe("Practice");
  expect(form.get("steps")).toBe("[]");
  expect([...form.keys()].at(-1)).toBe("video");
  expect(form.get("video").name).toBe("sample.mp4");
  expect(form.has("includeVideo")).toBe(false);
});

test("protected login, dashboard count, session storage and logout", async () => {
  axios.post.mockResolvedValue({ data: session() });
  await mount("dashboard", false);
  expect(location.pathname).toBe("/admin/login");
  await fill(container.querySelector("input[type=email]"), "admin@example.com");
  await fill(container.querySelector("input[type=password]"), "password");
  await click("Sign in");
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining("/api/admin/login"),
    { email: "admin@example.com", password: "password" },
  );
  expect(container.querySelector("h1").textContent).toBe("Welcome, Test Admin");
  expect(
    [...container.querySelectorAll('a[href="/admin/education-loans"]')].some(
      (el) => el.textContent.includes("9"),
    ),
  ).toBe(true);
  expect(sessionStorage.getItem("isst_admin_session")).toBeTruthy();
  expect(localStorage.getItem("isst_admin_session")).toBeNull();
  await click("Sign out");
  expect(location.pathname).toBe("/admin/login");
  expect(sessionStorage.getItem("isst_admin_session")).toBeNull();
});

test.each([
  ["education-levels", "Education Levels"],
  ["skill-development", "Skill Development"],
  ["course-selection", "Course Selection"],
  ["career-route-map", "Career Route Map"],
  ["college-selection", "College Selection"],
  ["banners", "Banners"],
  ["scholarships", "Scholarships"],
  ["entrance-exams", "Entrance Exams"],
  ["education-loans", "Education Loans"],
  ["admissions", "Admissions"],
  ["placement-trainings", "Placement Trainings"],
  ["entrance-exams/categories", "Exam Categories"],
  ["education-loans/categories", "Loan Categories"],
  ["admissions/categories", "Admission Categories"],
  ["placement-trainings/categories", "Placement Categories"],
])("renders route /admin/%s with its own hero", async (path, heading) => {
  await mount(path);
  expect(container.querySelector("h1").textContent).toBe(heading);
  expect(container.querySelector(".section-hero")).toBeTruthy();
});

test("Placement details, editing, video removal, pagination and delete confirmation", async () => {
  await mount("placement-trainings");
  expect(container.querySelector('td[data-label="S.No."]').textContent).toBe(
    "1",
  );
  await click("Next page");
  expect(container.querySelector('td[data-label="S.No."]').textContent).toBe(
    "21",
  );
  expect(client.get).toHaveBeenCalledWith(
    "/api/admin/placement-trainings/all",
    { params: { page: 2, limit: 20 } },
  );
  await click("View details");
  expect(container.querySelector("[role=dialog] h2").textContent).toBe(
    training.title,
  );
  expect(container.querySelector("video").getAttribute("src")).toBe(
    training.videoUrl,
  );
  await click("Edit", container.querySelector("[role=dialog]"));
  await click("Remove video");
  await click("Save changes");
  expect(client.patch).toHaveBeenCalledWith(
    "/api/admin/placement-trainings/update",
    expect.objectContaining({ trainingId: id, videoUrl: null, targets: [] }),
  );
  await click("Delete");
  expect(client.delete).not.toHaveBeenCalled();
  await click("Delete", container.querySelector("[role=alertdialog]"));
  expect(client.delete).toHaveBeenCalledWith(
    "/api/admin/placement-trainings/delete",
    { data: { trainingId: id } },
  );
});

test("category creation and dependent Admission targets and status payload", async () => {
  await mount("admissions/categories");
  expect(container.querySelector("th.record-table-number").textContent).toBe(
    "S.No.",
  );
  expect(container.querySelector("td.record-table-number").textContent).toBe(
    "1",
  );
  await click("Add category");
  await fill(field("Title"), "Fresh intake");
  await fill(field("Description"), "Admissions category");
  await click("Save changes");
  expect(client.post).toHaveBeenCalledWith(
    "/api/admin/admission-categories/create",
    { title: "Fresh intake", description: "Admissions category" },
  );
  await click("Admissions", container.querySelector(".panel"));
  await click("Add admission");
  const dialog = container.querySelector("[role=dialog]");
  const controls = {
    "College name": "Example university",
    Location: "Hyderabad",
    Tag: "B.Tech",
    Description: "Description",
    Eligibility: "Completed school",
    "Fees label": "₹50,000",
    Deadline: "Rolling",
    Accreditation: "NAAC",
  };
  for (const [key, value] of Object.entries(controls))
    await fill(field(key, dialog), value);
  await fill(field("Admission status", dialog), "Closing soon");
  const level = dialog.querySelector('select[aria-label="Education level"]');
  const course = dialog.querySelector('select[aria-label="Course"]');
  const branch = dialog.querySelector('select[aria-label="Branch"]');
  expect(course.disabled).toBe(true);
  await fill(level, "Degree");
  await fill(course, "Engineering");
  await fill(branch, "CSE");
  await click("Add course", dialog);
  await fill(
    dialog.querySelector('input[aria-label="Course 1"]'),
    "B.Tech CSE",
  );
  await click("Save changes", dialog);
  expect(client.post).toHaveBeenCalledWith(
    "/api/admin/admissions/create",
    expect.objectContaining({
      status: "Closing soon",
      courses: ["B.Tech CSE"],
      targets: [{ level: "Degree", course: "Engineering", branch: "CSE" }],
    }),
  );
});

test("401 responses clear the active session and return to login", async () => {
  await mount("dashboard");
  const error = {
    response: { status: 401 },
    config: { url: "/api/admin/loans/all" },
  };
  await act(async () => {
    await expect(responseFailure(error)).rejects.toBe(error);
  });
  expect(location.pathname).toBe("/admin/login");
  expect(sessionStorage.getItem("isst_admin_session")).toBeNull();
});

test("Loan form accepts a zero rate and sends a null URL for in-app applications", async () => {
  await mount("education-loans");
  await click("Add education loan");
  const dialog = container.querySelector("[role=dialog]");
  for (const [label, value] of Object.entries({
    Name: "Sample education loan",
    Lender: "Sample bank",
    Tag: "India",
    Description: "Funding",
    Eligibility: "Degree",
    "Interest rate label": "Zero interest",
    "Minimum interest": "0",
    "Maximum interest": "0",
    "Maximum amount label": "Up to ₹100,000",
    "Maximum amount (": "100000",
    "Collateral label": "None",
    "Tenure label": "Five years",
    "Maximum tenure (": "5",
    Moratorium: "None",
    "Processing fee": "Nil",
  }))
    await fill(field(label, dialog), value);
  expect(field("Application URL", dialog)).toBeDefined();
  await fill(field("Application type", dialog), "form");
  expect(field("Application URL", dialog)).toBeUndefined();
  await fill(
    dialog.querySelector('select[aria-label="Education level"]'),
    "Degree",
  );
  await click("Save changes", dialog);
  expect(client.post).toHaveBeenCalledWith(
    "/api/admin/loans/create",
    expect.objectContaining({
      interestMin: 0,
      interestMax: 0,
      applyType: "form",
      applyUrl: null,
      targets: [{ level: "Degree" }],
    }),
  );
});
