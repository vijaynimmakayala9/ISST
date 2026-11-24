import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";
import AdminLayout from "./components/layout/AdminLayout";
import LoginPage from "./modules/Login/LoginPage";
import DashboardPage from "./modules/Dashboard/DashboardPage";
import AllEducationLevels from "./modules/EducationLevels/AllEducationLevels";
import AllSkillCourses from "./modules/SkillDevelopment/AllSkillCourses";
import AllCourseSelections from "./modules/CourseSelection/AllCourseSelections";
import AllCareerRoutes from "./modules/CareerRouteMap/AllCareerRoutes";
import AllColleges from "./modules/CollegeSelection/AllColleges";
import AllBanners from "./modules/Banners/AllBanners";
import AllScholarships from "./modules/Scholarship/AllScholarships";
import AllEntranceExams from "./modules/EntranceExam/AllEntranceExams";
import AllEducationLoans from "./modules/EducationLoans/AllEducationLoans";
import AllAdmissions from "./modules/Admissions/AllAdmissions";
import AllPlacementTrainings from "./modules/PlacementTrainings/AllPlacementTrainings";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/admin/login" element={<LoginPage />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="education-levels" element={<AllEducationLevels />} />
              <Route path="skill-development" element={<AllSkillCourses />} />
              <Route
                path="course-selection"
                element={<AllCourseSelections />}
              />
              <Route path="career-route-map" element={<AllCareerRoutes />} />
              <Route path="college-selection" element={<AllColleges />} />
              <Route path="banners" element={<AllBanners />} />
              <Route path="scholarships" element={<AllScholarships />} />
              <Route path="entrance-exams" element={<AllEntranceExams />} />
              <Route
                path="scholarships/categories"
                element={<AllScholarships />}
              />
              <Route
                path="entrance-exams/categories"
                element={<AllEntranceExams />}
              />
              <Route path="education-loans" element={<AllEducationLoans />} />
              <Route
                path="education-loans/categories"
                element={<AllEducationLoans />}
              />
              <Route path="admissions" element={<AllAdmissions />} />
              <Route path="admissions/categories" element={<AllAdmissions />} />
              <Route
                path="placement-trainings"
                element={<AllPlacementTrainings />}
              />
              <Route
                path="placement-trainings/categories"
                element={<AllPlacementTrainings />}
              />
            </Route>
          </Route>
          <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
