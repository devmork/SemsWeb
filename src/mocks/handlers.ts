import { http, HttpResponse, delay } from "msw";
import type { StudentProfileData } from "@/features/student/types";
import type { AuthUser } from "@/types/domain";

// ==========================================
// IN-MEMORY DATABASE
// ==========================================
const mockCurrentUser: AuthUser = {
  id: 1,
  name: "Jon Christopher Erasmo",
  email: "jon_erasmo@dmc.edu.ph",
  role: "student",
  pictureUrl: null,
};

const mockProfile: StudentProfileData = {
  id: "2023-0444",
  firstName: "Jon Christopher",
  lastName: "Erasmo",
  suffix: null,
  email: "jon_erasmo@dmc.edu.ph",
  avatarUrl: null,
  program: "BSIT",
  yearLevel: "3",
  academicYear: "2026-2027",
  semester: "1",
  enrollmentStatus: "Enrolled",
};

const mockEvaluationTypes = [
  { evaluationTypeId: 1, evaluationTypeName: "Teacher Evaluation" },
  { evaluationTypeId: 2, evaluationTypeName: "Facility Evaluation" },
];

const mockCategories = [
  {
    catNo: 1,
    evaluationTypeId: 1,
    catRn: "A",
    catName: "Teaching Effectiveness",
    catRate: 25.0,
  },
  {
    catNo: 2,
    evaluationTypeId: 1,
    catRn: "B",
    catName: "Classroom Management",
    catRate: 20.0,
  },
  {
    catNo: 3,
    evaluationTypeId: 2,
    catRn: "C",
    catName: "Cleanliness",
    catRate: 50.0,
  },
];

const mockQuestions = [
  { qnNo: 1, catNo: 1, qnName: "The teacher explains lessons clearly." },
  { qnNo: 2, catNo: 1, qnName: "The teacher uses appropriate examples." },
  { qnNo: 3, catNo: 2, qnName: "The teacher maintains an orderly classroom." },
  { qnNo: 4, catNo: 3, qnName: "The facility is clean and well-maintained." },
];

const mockForms = [
  {
    formId: 1,
    code: "PRE-G3",
    gradeBand: "Preschool-G3",
    targetType: "SubjectTeacher",
    programId: 1,
    evaluationTypeId: 1,
    evaluationTypeName: "Teacher Evaluation",
    title: "Preschool - Grade 3 Teacher Evaluation",
    description: "Evaluation form for teachers handling Preschool to Grade 3.",
    createdBy: 1,
    isActive: 1,
    createdAt: new Date().toISOString(),
  },
];

let mockUsers = [
  {
    userId: 1,
    fullName: "Jon Christopher Erasmo",
    email: "jon_erasmo@dmc.edu.ph",
    role: "student",
    status: "Active",
    lastLoginAt: new Date().toISOString(),
  },
  {
    userId: 2,
    fullName: "Den Mark Enoy",
    email: "den_enoy@dmc.edu.ph",
    role: "qa",
    status: "Active",
    lastLoginAt: new Date().toISOString(),
  },
];

// ==========================================
// HANDLERS
// ==========================================
export const handlers = [
  // ----------------------------------------
  // AUTH
  // ----------------------------------------
  // GET /api/auth/me - Used by restoreSession() to check if logged in
  http.get("/api/auth/me", async () => {
    await delay(300);
    // To test the "not logged in" state, change this to:
    // return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({
      id: mockCurrentUser.id,
      email: mockCurrentUser.email,
      firstName: mockProfile.firstName,
      lastName: mockProfile.lastName,
      pictureUrl: mockCurrentUser.pictureUrl,
      role: mockCurrentUser.role,
    });
  }),

  // POST /api/auth/logout
  http.post("/api/auth/logout", async () => {
    await delay(200);
    return new HttpResponse(null, { status: 204 });
  }),

  // ----------------------------------------
  // STUDENT PROFILE
  // ----------------------------------------
  // GET /api/student/profile
  http.get("/api/student/profile", async () => {
    await delay(800); // Simulate latency for skeleton loader
    return HttpResponse.json(mockProfile);
  }),

  // ----------------------------------------
  // ADMIN - USER MANAGEMENT
  // ----------------------------------------
  // GET /api/admin/users
  http.get("/api/admin/users", async () => {
    await delay(500);
    return HttpResponse.json(mockUsers);
  }),

  // POST /api/superadmin/users/:userId/role
  http.post(
    "/api/superadmin/users/:userId/role",
    async ({ request, params }) => {
      const { role } = (await request.json()) as { role: string };
      const userId = Number(params.userId);
      await delay(400);

      mockUsers = mockUsers.map((u) =>
        u.userId === userId ? { ...u, role } : u,
      );
      return HttpResponse.json({ success: true });
    },
  ),

  // ----------------------------------------
  // EVALUATION TYPES
  // ----------------------------------------
  // GET /api/evaluation/types
  http.get("/api/evaluation/types", async () => {
    await delay(300);
    return HttpResponse.json(mockEvaluationTypes);
  }),

  // ----------------------------------------
  // CATEGORIES
  // ----------------------------------------
  // GET /api/evaluation/categories?evaluationTypeId=1
  http.get("/api/evaluation/categories", async ({ request }) => {
    const url = new URL(request.url);
    const typeId = url.searchParams.get("evaluationTypeId");
    await delay(300);

    if (typeId) {
      const filtered = mockCategories.filter(
        (c) => c.evaluationTypeId === Number(typeId),
      );
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(mockCategories);
  }),

  // ----------------------------------------
  // QUESTIONS
  // ----------------------------------------
  // GET /api/evaluation/questions?catNo=1
  http.get("/api/evaluation/questions", async ({ request }) => {
    const url = new URL(request.url);
    const catNo = url.searchParams.get("catNo");
    await delay(300);

    let filtered = mockQuestions;
    if (catNo) {
      filtered = filtered.filter((q) => q.catNo === Number(catNo));
    }
    // Note: typeId filtering would normally require joining with categories,
    // but for this mock we will just return based on catNo.

    return HttpResponse.json(filtered);
  }),

  // ----------------------------------------
  // FORMS
  // ----------------------------------------
  // GET /api/evaluation/forms
  http.get("/api/evaluation/forms", async ({ request }) => {
    const url = new URL(request.url);
    const typeId = url.searchParams.get("evaluationTypeId");
    await delay(400);

    if (typeId) {
      const filtered = mockForms.filter(
        (f) => f.evaluationTypeId === Number(typeId),
      );
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(mockForms);
  }),

  // GET /api/evaluation/forms/:formId (Returns FormDetailDto with categories and questions)
  http.get("/api/evaluation/forms/:formId", async ({ params }) => {
    await delay(500);
    const form = mockForms.find((f) => f.formId === Number(params.formId));
    if (!form) return new HttpResponse(null, { status: 404 });

    const formCategories = mockCategories.filter(
      (c) => c.evaluationTypeId === form.evaluationTypeId,
    );

    const detail = {
      ...form,
      categories: formCategories.map((cat) => ({
        catNo: cat.catNo,
        catRn: cat.catRn,
        catName: cat.catName,
        catRate: cat.catRate,
        questions: mockQuestions
          .filter((q) => q.catNo === cat.catNo)
          .map((q) => ({ qnNo: q.qnNo, qnName: q.qnName })),
      })),
    };

    return HttpResponse.json(detail);
  }),

  // ----------------------------------------
  // SUBMIT EVALUATION (Guidance)
  // ----------------------------------------
  // POST /api/evaluation/guidance/submit
  http.post("/api/evaluation/guidance/submit", async ({ request }) => {
    const payload = await request.json();
    await delay(800); // Simulate a slow database transaction

    console.log("Mock Received Evaluation Submission:", payload);

    // Simulate duplicate check failure from backend
    // if (payload.studentId === "duplicate-test") {
    //   return new HttpResponse(JSON.stringify({ message: "This student has already submitted the evaluation for this term." }), { status: 409 });
    // }

    return HttpResponse.json({
      message: "Guidance evaluation submitted successfully.",
    });
  }),
];
