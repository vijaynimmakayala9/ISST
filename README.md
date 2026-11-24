# ISST Admin Panel

## Run locally

1. Extract the ZIP and open its project folder.
2. Run `npm ci` to install the locked dependencies.
3. Copy `.env.example` to `.env` and set `REACT_APP_API_URL` to your ISST backend origin. Use `cp .env.example .env` on macOS or Linux and `copy .env.example .env` in Windows Command Prompt.
4. Run `npm start` and open `http://localhost:3000/admin/login`. Sign in with your existing ISST administrator account.
5. Run `npm run build` for the production build. Configure the host to serve `index.html` for frontend routes, including direct visits to `/admin/…`. Use an HTTPS API origin when serving the panel over HTTPS.

## Changes

- Each feature owns its list screen, record details, add/edit form, and API calls. Category management uses dedicated routes and category editors within the relevant features.
- The indigo redesign includes distinct local WebP photographs for dashboard, section, and category banners, plus photographic login and sidebar treatments. Dashboard counts come from the existing and newly integrated APIs.
- The shared admin shell is split into `AdminLayout.jsx`, `Header.jsx`, and `Sidebar.jsx`.
- The sidebar expands the current section, supports a compact desktop mode and a mobile overlay, and shows the signed-in admin profile.
- Use **Manage courses** on an Education Level row to jump to its courses. Expand a course for branch actions.
- All record and category tables include S.No. with continuous numbering for paginated records. At narrow widths, rows stack with field labels and visible actions.
- Existing guidance, banners, scholarship management, nested courses and branches, and career roadmap stages are carried forward.
- Admin login uses the existing login endpoint. JWT sessions use `sessionStorage`, and logout, expiry, or an authenticated 401 clears the session.

## Integrated APIs

| Module              | Workflow                                                                                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entrance Exams      | Updated the existing integration with all documented filters, paginated exam CRUD, category CRUD and dependent education targets.                         |
| Education Loans     | Category and loan CRUD, rate and amount filters, sorting, numeric and range validation, direct and in-app applications, and document lists.               |
| Admissions          | Category and admission CRUD, manual status, courses offered, documents, and separate education targets.                                                   |
| Placement Trainings | Category and training CRUD, external links, thumbnail previews, indexed multipart video uploads, replacement and removal, and optional education targets. |

## Verification

- `npm ci` completed using the supplied lockfile.
- `CI=true npm run build` compiled successfully.
- `npm test -- --runInBand` passed 25 checks using mocked API responses. They cover all four documented CRUD contracts, login and logout, protected routes, 401 handling, section rendering, dependent targets, category creation, loan form values, and training video behavior.
- Chromium startup was blocked in the execution environment, so responsive rendering remains unverified in a desktop or mobile browser. Live authenticated requests and real backend file uploads were outside the test run.
- Education Levels and Banners use the selected list record for details because the original project does not document dedicated get-by-ID endpoints for those sections.

## Source files removed

The following source files were superseded during the migration.

- `src/api/endpoints.js`
- `src/api/modules.js`
- `src/components/common/Button.jsx`
- `src/components/common/ConfirmModal.jsx`
- `src/components/common/DataTable.jsx`
- `src/components/common/EmptyState.jsx`
- `src/components/common/GuidanceResourcePage.jsx`
- `src/components/common/InputField.jsx`
- `src/components/common/LoadingSpinner.jsx`
- `src/components/common/MediaPreview.jsx`
- `src/components/common/ModuleManager.jsx`
- `src/components/common/PageHeader.jsx`
- `src/components/common/Pagination.jsx`
- `src/components/common/RecordDetailsModal.jsx`
- `src/components/common/RecordEditor.jsx`
- `src/components/common/RecordTable.jsx`
- `src/components/common/SearchInput.jsx`
- `src/components/common/SelectField.jsx`
- `src/components/common/StatusBadge.jsx`
- `src/components/common/TargetSelector.jsx`
- `src/components/layout/MobileSidebar.jsx`
- `src/modules/Banners/BannersPage.jsx`
- `src/modules/Banners/components/BannerForm.jsx`
- `src/modules/Banners/components/BannerPreview.jsx`
- `src/modules/Banners/components/BannerTable.jsx`
- `src/modules/CareerRouteMap/CareerRouteMapPage.jsx`
- `src/modules/CareerRouteMap/components/CareerRouteForm.jsx`
- `src/modules/CareerRouteMap/components/CareerRouteTable.jsx`
- `src/modules/CareerRouteMap/components/StageManager.jsx`
- `src/modules/CollegeSelection/CollegeSelectionPage.jsx`
- `src/modules/CollegeSelection/components/CollegeForm.jsx`
- `src/modules/CollegeSelection/components/CollegeTable.jsx`
- `src/modules/CourseSelection/CourseSelectionPage.jsx`
- `src/modules/CourseSelection/components/CourseSelectionForm.jsx`
- `src/modules/CourseSelection/components/CourseSelectionTable.jsx`
- `src/modules/EducationLevels/EducationLevelsPage.jsx`
- `src/modules/EducationLevels/components/BranchManager.jsx`
- `src/modules/EducationLevels/components/EducationLevelForm.jsx`
- `src/modules/EducationLevels/components/EducationLevelTable.jsx`
- `src/modules/EntranceExam/EntranceExamPage.jsx`
- `src/modules/Scholarship/ScholarshipPage.jsx`
- `src/modules/SkillDevelopment/SkillDevelopmentPage.jsx`
- `src/modules/SkillDevelopment/components/SkillCourseForm.jsx`
- `src/modules/SkillDevelopment/components/SkillCourseTable.jsx`
- `src/utils/errorHandler.js`
- `src/utils/formatDate.js`

## Project structure

```text
ISST_Admin_Panel_Redesigned/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── axiosInstance.js
│   ├── assets/
│   │   └── images/
│   │       ├── admissions-categories.webp
│   │       ├── admissions.webp
│   │       ├── banners.webp
│   │       ├── career-route-map.webp
│   │       ├── college-selection.webp
│   │       ├── course-selection.webp
│   │       ├── dashboard.webp
│   │       ├── education-levels.webp
│   │       ├── education-loans-categories.webp
│   │       ├── education-loans.webp
│   │       ├── entrance-exams-categories.webp
│   │       ├── entrance-exams.webp
│   │       ├── login.webp
│   │       ├── placement-trainings-categories.webp
│   │       ├── placement-trainings.webp
│   │       ├── scholarships-categories.webp
│   │       ├── scholarships.webp
│   │       └── skill-development.webp
│   ├── auth/
│   │   ├── AuthContext.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   └── sessionManager.js
│   ├── components/
│   │   └── layout/
│   │       ├── AdminLayout.jsx
│   │       ├── Header.jsx
│   │       └── Sidebar.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   ├── modules/
│   │   ├── Admissions/
│   │   │   ├── AddEditAdmission.jsx
│   │   │   ├── AddEditAdmissionCategory.jsx
│   │   │   ├── admissionApi.js
│   │   │   ├── AllAdmissions.jsx
│   │   │   └── SingleAdmission.jsx
│   │   ├── Banners/
│   │   │   ├── AddEditBanner.jsx
│   │   │   ├── AllBanners.jsx
│   │   │   ├── bannersApi.js
│   │   │   └── SingleBanner.jsx
│   │   ├── CareerRouteMap/
│   │   │   ├── AddEditCareerRoute.jsx
│   │   │   ├── AllCareerRoutes.jsx
│   │   │   ├── careerRouteMapApi.js
│   │   │   └── SingleCareerRoute.jsx
│   │   ├── CollegeSelection/
│   │   │   ├── AddEditCollege.jsx
│   │   │   ├── AllColleges.jsx
│   │   │   ├── collegeSelectionApi.js
│   │   │   └── SingleCollege.jsx
│   │   ├── CourseSelection/
│   │   │   ├── AddEditCourseSelection.jsx
│   │   │   ├── AllCourseSelections.jsx
│   │   │   ├── courseSelectionApi.js
│   │   │   └── SingleCourseSelection.jsx
│   │   ├── Dashboard/
│   │   │   ├── components/
│   │   │   │   ├── DashboardOverview.jsx
│   │   │   │   └── StatsCard.jsx
│   │   │   ├── dashboardApi.js
│   │   │   └── DashboardPage.jsx
│   │   ├── EducationLevels/
│   │   │   ├── components/
│   │   │   │   └── CourseManager.jsx
│   │   │   ├── AddEditEducationLevel.jsx
│   │   │   ├── AllEducationLevels.jsx
│   │   │   ├── educationLevelsApi.js
│   │   │   └── SingleEducationLevel.jsx
│   │   ├── EducationLoans/
│   │   │   ├── AddEditEducationLoan.jsx
│   │   │   ├── AddEditLoanCategory.jsx
│   │   │   ├── AllEducationLoans.jsx
│   │   │   ├── educationLoanApi.js
│   │   │   └── SingleEducationLoan.jsx
│   │   ├── EntranceExam/
│   │   │   ├── AddEditEntranceExam.jsx
│   │   │   ├── AddEditExamCategory.jsx
│   │   │   ├── AllEntranceExams.jsx
│   │   │   ├── entranceExamApi.js
│   │   │   └── SingleEntranceExam.jsx
│   │   ├── Login/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.jsx
│   │   │   └── LoginPage.jsx
│   │   ├── PlacementTrainings/
│   │   │   ├── AddEditPlacementCategory.jsx
│   │   │   ├── AddEditPlacementTraining.jsx
│   │   │   ├── AllPlacementTrainings.jsx
│   │   │   ├── placementTrainingApi.js
│   │   │   └── SinglePlacementTraining.jsx
│   │   ├── Scholarship/
│   │   │   ├── AddEditScholarship.jsx
│   │   │   ├── AddEditScholarshipCategory.jsx
│   │   │   ├── AllScholarships.jsx
│   │   │   ├── scholarshipApi.js
│   │   │   └── SingleScholarship.jsx
│   │   └── SkillDevelopment/
│   │       ├── AddEditSkillCourse.jsx
│   │       ├── AllSkillCourses.jsx
│   │       ├── SingleSkillCourse.jsx
│   │       └── skillDevelopmentApi.js
│   ├── App.js
│   ├── index.css
│   ├── index.js
│   └── verification.test.js
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js
```

#   I S S T 
 
 
