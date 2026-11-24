import { list as levels } from "../EducationLevels/educationLevelsApi";
import { list as skills } from "../SkillDevelopment/skillDevelopmentApi";
import { list as courses } from "../CourseSelection/courseSelectionApi";
import { list as careers } from "../CareerRouteMap/careerRouteMapApi";
import { list as colleges } from "../CollegeSelection/collegeSelectionApi";
import { list as banners } from "../Banners/bannersApi";
import { scholarshipApi } from "../Scholarship/scholarshipApi";
import { entranceExamApi } from "../EntranceExam/entranceExamApi";
import { educationLoanApi } from "../EducationLoans/educationLoanApi";
import { admissionApi } from "../Admissions/admissionApi";
import { placementTrainingApi } from "../PlacementTrainings/placementTrainingApi";

export const countRequests = {
  "education-levels": async () => (await levels()).total,
  "skill-development": async () => (await skills()).total,
  "course-selection": async () => (await courses()).total,
  "career-route-map": async () => (await careers()).total,
  "college-selection": async () => (await colleges()).total,
  banners: async () => (await banners()).total,
  scholarships: async () => (await scholarshipApi.list()).length,
  "entrance-exams": async () =>
    (await entranceExamApi.list({ limit: 1 })).total,
  "education-loans": async () =>
    (await educationLoanApi.list({ limit: 1 })).total,
  admissions: async () => (await admissionApi.list({ limit: 1 })).total,
  "placement-trainings": async () =>
    (await placementTrainingApi.list({ limit: 1 })).total,
};
