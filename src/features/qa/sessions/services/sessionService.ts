import { api } from "@/shared/api/client";
import type {
  CreateSessionInput,
  FacilityOption,
  Session,
  SessionDetail,
  SessionStatus,
  SessionSubmission,
  UpdateSessionInput,
} from "../types";

/** Mirrors `SemsApi.DTO.EvaluationSessions.EvaluationSessionDto` (camelCase on the wire). */
type SessionDto = {
  evaluationSessionId: number;
  formId: number;
  formTitle: string;
  evaluationTypeId: number;
  evaluationTypeName: string;
  facilityId: number | null;
  facilityName: string | null;
  schoolYear: string;
  term: number;
  gradeLevelFrom: number | null;
  gradeLevelTo: number | null;
  opensAtUtc: string | null;
  closesAtUtc: string | null;
  status: string;
  notes: string | null;
  createdBy: number;
  createdAtUtc: string;
  updatedAtUtc: string;
  submissionCount: number;
  isAvailableNow: boolean;
};

/** Mirrors `EvaluationSessionDetailDto` — a session plus its form tree. */
type SessionDetailDto = SessionDto & {
  evaluationForm: FormDetailDto | null;
};

type FormDetailDto = {
  formId: number;
  evaluationTypeId: number;
  evaluationTypeName: string;
  title: string;
  description: string | null;
  createdBy: number;
  isActive: number;
  createdAt: string;
  categories: {
    categoryId: number;
    categoryName: string | null;
    categoryRate: number | null;
    questions: { questionId: number; questionName: string | null }[];
  }[];
};

/** Mirrors `SemsApi.DTO.EvaluationSessions.SessionSubmissionDto`. */
type SubmissionDto = {
  submissionId: number;
  studentId: number;
  studentName: string;
  studentNumber: string;
  subjectCode: string;
  teacherName: string;
  submittedAtUtc: string;
};

/** `POST`/`PUT /api/evaluation/sessions` wrap the payload in `{ message, data }`. */
type SessionEnvelope = { message: string; data: SessionDto };

function toSession(dto: SessionDto): Session {
  return {
    id: dto.evaluationSessionId,
    formId: dto.formId,
    formTitle: dto.formTitle,
    evaluationTypeId: dto.evaluationTypeId,
    evaluationTypeName: dto.evaluationTypeName,
    facilityId: dto.facilityId ?? null,
    facilityName: dto.facilityName ?? null,
    schoolYear: dto.schoolYear,
    term: dto.term,
    gradeLevelFrom: dto.gradeLevelFrom ?? null,
    gradeLevelTo: dto.gradeLevelTo ?? null,
    opensAtUtc: dto.opensAtUtc,
    closesAtUtc: dto.closesAtUtc,
    status: dto.status as SessionStatus,
    notes: dto.notes,
    createdBy: dto.createdBy,
    createdAtUtc: dto.createdAtUtc,
    updatedAtUtc: dto.updatedAtUtc,
    submissionCount: dto.submissionCount,
    isAvailableNow: dto.isAvailableNow,
  };
}

function toSessionDetail(dto: SessionDetailDto): SessionDetail {
  return {
    ...toSession(dto),
    evaluationForm: dto.evaluationForm
      ? {
          formId: dto.evaluationForm.formId,
          evaluationTypeId: dto.evaluationForm.evaluationTypeId,
          evaluationTypeName: dto.evaluationForm.evaluationTypeName,
          title: dto.evaluationForm.title,
          description: dto.evaluationForm.description,
          createdBy: dto.evaluationForm.createdBy,
          isActive: dto.evaluationForm.isActive === 1 ? 1 : 0,
          createdAt: dto.evaluationForm.createdAt,
          categories: (dto.evaluationForm.categories ?? []).map((category) => ({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            categoryRate: category.categoryRate,
            questions: (category.questions ?? []).map((question) => ({
              questionId: question.questionId,
              questionName: question.questionName,
            })),
          })),
        }
      : null,
  };
}

function toSubmission(dto: SubmissionDto): SessionSubmission {
  return {
    submissionId: dto.submissionId,
    studentId: dto.studentId,
    studentName: dto.studentName,
    studentNumber: dto.studentNumber,
    subjectCode: dto.subjectCode,
    teacherName: dto.teacherName,
    submittedAtUtc: dto.submittedAtUtc,
  };
}

export const sessionService = {
  async getSessions(params?: {
    formId?: number;
    schoolYear?: string;
    term?: number;
    status?: SessionStatus;
    onlyOpen?: boolean;
  }): Promise<Session[]> {
    const { data } = await api.get<SessionDto[]>("/api/evaluation/sessions", {
      params,
    });
    return data.map(toSession);
  },

  /** Active facilities available as targets for a facility evaluation session. */
  async getSessionFacilities(): Promise<FacilityOption[]> {
    const { data } = await api.get<unknown>("/api/facilities", {
      params: { isActive: true },
    });
    if (!Array.isArray(data)) return [];
    return (data as { facilityId: number; facilityName: string }[]).map((f) => ({
      facilityId: f.facilityId,
      facilityName: f.facilityName,
    }));
  },

  async getSession(id: number): Promise<SessionDetail> {
    const { data } = await api.get<SessionDetailDto>(
      `/api/evaluation/sessions/${id}`,
    );
    return toSessionDetail(data);
  },

  async createSession(input: CreateSessionInput): Promise<Session> {
    const { data } = await api.post<SessionEnvelope>(
      "/api/evaluation/sessions",
      input,
    );
    return toSession(data.data);
  },

  async updateSession(
    id: number,
    input: UpdateSessionInput,
  ): Promise<Session> {
    const { data } = await api.put<SessionEnvelope>(
      `/api/evaluation/sessions/${id}`,
      input,
    );
    return toSession(data.data);
  },

  async deleteSession(id: number): Promise<void> {
    await api.delete(`/api/evaluation/sessions/${id}`);
  },

  async openSession(id: number): Promise<void> {
    await api.post(`/api/evaluation/sessions/${id}/open`);
  },

  async closeSession(id: number): Promise<void> {
    await api.post(`/api/evaluation/sessions/${id}/close`);
  },

  async getSubmissions(id: number): Promise<SessionSubmission[]> {
    const { data } = await api.get<SubmissionDto[]>(
      `/api/evaluation/sessions/${id}/submissions`,
    );
    return data.map(toSubmission);
  },
};
