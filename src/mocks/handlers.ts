import { http, HttpResponse, delay } from "msw";

// ==========================================
// IN-MEMORY DATABASE
// ==========================================

const mockEvaluationTypes = [
  { evaluationTypeId: 1, evaluationTypeName: "Teacher Evaluation" },
  { evaluationTypeId: 2, evaluationTypeName: "Facility Evaluation" },
];

const mockCategories: Array<{
  catNo: number;
  evaluationTypeId: number;
  catRn: string;
  catName: string;
  catRate: number;
}> = [
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

const mockQuestions: Array<{
  qnNo: number;
  catNo: number;
  qnName: string;
}> = [
  { qnNo: 1, catNo: 1, qnName: "The teacher explains lessons clearly." },
  { qnNo: 2, catNo: 1, qnName: "The teacher uses appropriate examples." },
  { qnNo: 3, catNo: 2, qnName: "The teacher maintains an orderly classroom." },
  { qnNo: 4, catNo: 3, qnName: "The facility is clean and well-maintained." },
];

// shape consumed by categoryService / useCategories (management UI)
function toManagementCategory(c: (typeof mockCategories)[number]) {
  return {
    id: c.catNo,
    name: c.catName,
    weightPercentage: c.catRate,
    questionCount: mockQuestions.filter((q) => q.catNo === c.catNo).length,
    createdAt: new Date().toISOString(),
  };
}

let nextCatNo = 100;

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

  // POST /api/auth/logout
  http.post("/api/auth/logout", async () => {
    await delay(200);
    return new HttpResponse(null, { status: 204 });
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
  // STUDENT EVALUATIONS
  // ----------------------------------------

  // GET /api/evaluation/my-evaluations
  http.get("/api/evaluation/my-evaluations/teachers", async () => {
    await delay(600);
    const teachers = [
      {
        id: 1,
        type: "teacher",
        status: "pending",
        teacherName: "Prof. Alan Turing",
        subjectCode: "IT 312",
        section: "BSIT 3A",
        formTitle: "Teacher Evaluation Form",
        formDescription: "Evaluate teaching effectiveness.",
        dueDate: "2026-11-15T23:59:59Z",
        questionCount: 15,
        academicYear: "AY 2026-2027",
        semester: "1st Semester",
      },
      {
        id: 3,
        type: "teacher",
        status: "overdue",
        teacherName: "Dr. Alejandro Cruz",
        subjectCode: "IT 314",
        section: "BSIT 3A",
        formTitle: "Teacher Evaluation Form",
        formDescription: "Evaluate teaching effectiveness.",
        dueDate: "2026-10-20T23:59:59Z",
        questionCount: 15,
        academicYear: "AY 2026-2027",
        semester: "1st Semester",
      },
    ];
    return HttpResponse.json(teachers);
  }),

  // GET /api/evaluation/my-evaluations/facilities
  http.get("/api/evaluation/my-evaluations/facilities", async () => {
    await delay(600);
    const facilities = [
      {
        id: 2,
        type: "facility",
        status: "pending",
        facilityName: "Guidance & Counseling Office",
        location: "Student Affairs — Academic & Career Advising",
        category: "guidance",
        formTitle: "Guidance Evaluation",
        formDescription: "Evaluate the services of the guidance office.",
        dueDate: "2026-11-10T23:59:59Z",
        questionCount: 6,
        academicYear: "AY 2026-2027",
        semester: "1st Semester",
      },
      {
        id: 4,
        type: "facility",
        status: "completed",
        facilityName: "University Medical & Dental Clinic",
        location: "Campus Health — Medical & Dental Services",
        category: "clinic",
        formTitle: "Clinic Evaluation",
        formDescription: "Evaluate the services of the clinic.",
        dueDate: "2026-10-30T23:59:59Z",
        questionCount: 8,
        academicYear: "AY 2025-2026",
        semester: "2nd Semester",
      },
    ];
    return HttpResponse.json(facilities);
  }),

  http.post(
    "/api/evaluation/my-evaluations/:id/submit",
    async ({ request, params }) => {
      const payload = await request.json();
      const evaluationId = Number(params.id);

      // Simulate network delay
      await delay(1000);

      console.log(
        `Mock Received Submission for Evaluation ${evaluationId}:`,
        payload,
      );

      // Simulate a duplicate submission error for testing purposes
      // if (evaluationId === 1 && (payload as any).answers.length === 0) {
      //   return new HttpResponse(JSON.stringify({ message: "Evaluation already submitted." }), { status: 409 });
      // }

      return HttpResponse.json({
        success: true,
        message: "Evaluation submitted successfully.",
      });
    },
  ),

  http.get("/api/evaluation/my-evaluations/:id", async ({ params }) => {
    await delay(500);

    const mockDetail = {
      id: Number(params.id),
      title: "Student to Faculty Evaluation AY 2026-2027 (1ST SEMESTER)",
      targetName: "Prof. Maria Santos",
      targetSubtitle: "BSIT 3A — Web Systems & Development (IT 312)",
      dueDate: "2026-10-28T23:59:59Z",
      respondentEmail: "juan_delacruz@dmc.edu.ph",
      categories: [
        {
          id: 1,
          title: "TEACHING METHODOLOGY & PEDAGOGY",
          weightPercentage: 40,
          questions: [
            {
              id: 101,
              text: "The instructor clearly explains the course objectives and grading criteria.",
              isRequired: true,
            },
            {
              id: 102,
              text: "The instructor demonstrates thorough knowledge of the subject matter.",
              isRequired: true,
            },
            {
              id: 103,
              text: "The instructor uses varied teaching methods to engage students.",
              isRequired: true,
            },
          ],
        },
        {
          id: 2,
          title: "CLASSROOM MANAGEMENT",
          weightPercentage: 30,
          questions: [
            {
              id: 201,
              text: "The instructor maintains a respectful and inclusive classroom environment.",
              isRequired: true,
            },
            {
              id: 202,
              text: "The instructor manages class time effectively.",
              isRequired: true,
            },
            {
              id: 203,
              text: "The instructor addresses student disruptions appropriately.",
              isRequired: true,
            },
          ],
        },
      ],
    };

    return HttpResponse.json(mockDetail);
  }),

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
  // CATEGORY MANAGEMENT (QA UI — /api/categories)
  // ----------------------------------------
  // GET /api/categories
  http.get("/api/categories", async () => {
    await delay(300);
    return HttpResponse.json(mockCategories.map(toManagementCategory));
  }),

  // POST /api/categories
  http.post("/api/categories", async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      weightPercentage?: number;
    };
    await delay(300);
    if (!body.name?.trim() || body.weightPercentage == null) {
      return HttpResponse.json(
        { message: "name and weightPercentage are required" },
        { status: 422 },
      );
    }
    const catNo = nextCatNo++;
    const created = {
      catNo,
      evaluationTypeId: 1,
      catRn: String.fromCharCode(64 + (catNo % 26)) || "Z",
      catName: body.name.trim(),
      catRate: body.weightPercentage,
    };
    mockCategories.push(created);
    return HttpResponse.json(toManagementCategory(created), { status: 201 });
  }),

  // DELETE /api/categories/:id — guarded: refuses when questions remain
  http.delete("/api/categories/:id", async ({ params }) => {
    const id = Number(params.id);
    await delay(300);
    const idx = mockCategories.findIndex((c) => c.catNo === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const questionCount = mockQuestions.filter((q) => q.catNo === id).length;
    if (questionCount > 0) {
      return HttpResponse.json(
        { message: `Category still has ${questionCount} question(s) assigned` },
        { status: 409 },
      );
    }
    mockCategories.splice(idx, 1);
    return HttpResponse.json({ success: true });
  }),

  // PUT /api/categories/:id
  http.put("/api/categories/:id", async ({ request, params }) => {
    const body = (await request.json()) as {
      name?: string;
      weightPercentage?: number;
    };
    const id = Number(params.id);
    await delay(300);
    const idx = mockCategories.findIndex((c) => c.catNo === id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    const current = mockCategories[idx]!;
    const updated = {
      ...current,
      catName: body.name?.trim() ?? current.catName,
      catRate: body.weightPercentage ?? current.catRate,
    };
    mockCategories[idx] = updated;
    return HttpResponse.json(toManagementCategory(updated));
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
