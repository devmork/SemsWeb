import { api } from "@/shared/api/client";
import type {
  CreateSessionInput,
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
  formCode: string;
  formTitle: string;
  evaluationTypeId: number;
  evaluationTypeName: string;
  targetType: string;
  programId: number;
  schoolYear: string;
  term: number;
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
  form: FormDetailDto | null;
};

type FormDetailDto = {
  formId: number;
  code: string;
  gradeBand: string | null;
  targetType: string;
  programId: number;
  evaluationTypeId: number;
  evaluationTypeName: string;
  title: string;
  description: string | null;
  createdBy: number;
  isActive: number;
  createdAt: string;
  categories: {
    catNo: number;
    catRn: string | null;
    catName: string | null;
    catRate: number | null;
    questions: { qnNo: number; qnName: string | null }[];
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
    formCode: dto.formCode,
    formTitle: dto.formTitle,
    evaluationTypeId: dto.evaluationTypeId,
    evaluationTypeName: dto.evaluationTypeName,
    targetType: dto.targetType,
    programId: dto.programId,
    schoolYear: dto.schoolYear,
    term: dto.term,
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
    form: dto.form
      ? {
          formId: dto.form.formId,
          code: dto.form.code,
          gradeBand: dto.form.gradeBand,
          targetType: dto.form.targetType,
          programId: dto.form.programId,
          evaluationTypeId: dto.form.evaluationTypeId,
          evaluationTypeName: dto.form.evaluationTypeName,
          title: dto.form.title,
          description: dto.form.description,
          createdBy: dto.form.createdBy,
          isActive: dto.form.isActive === 1 ? 1 : 0,
          createdAt: dto.form.createdAt,
          categories: (dto.form.categories ?? []).map((category) => ({
            catNo: category.catNo,
            catRn: category.catRn,
            catName: category.catName,
            catRate: category.catRate,
            questions: (category.questions ?? []).map((question) => ({
              qnNo: question.qnNo,
              qnName: question.qnName,
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
