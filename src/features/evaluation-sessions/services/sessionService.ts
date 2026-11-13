import { api } from "@/shared/api/client";
import type {
  CreateSessionInput,
  Session,
  SessionStatus,
  SessionSubmission,
  UpdateSessionInput,
} from "../types";

type SessionDto = {
  EvaluationSessionId: number;
  FormId: number;
  FormCode: string;
  FormTitle: string;
  EvaluationTypeId: number;
  EvaluationTypeName: string;
  TargetType: string;
  ProgramId: number;
  SchoolYear: string;
  Term: number;
  OpensAtUtc: string | null;
  ClosesAtUtc: string | null;
  Status: string;
  Notes: string | null;
  CreatedBy: number;
  CreatedAtUtc: string;
  UpdatedAtUtc: string;
  SubmissionCount: number;
  IsAvailableNow: boolean;
};

type SubmissionDto = {
  SubmissionId: number;
  StudentId: number;
  StudentName: string;
  StudentNumber: string;
  SubjectCode: string;
  TeacherName: string;
  SubmittedAtUtc: string;
};

function toSession(dto: SessionDto): Session {
  return {
    id: dto.EvaluationSessionId,
    formId: dto.FormId,
    formCode: dto.FormCode,
    formTitle: dto.FormTitle,
    evaluationTypeId: dto.EvaluationTypeId,
    evaluationTypeName: dto.EvaluationTypeName,
    targetType: dto.TargetType,
    programId: dto.ProgramId,
    schoolYear: dto.SchoolYear,
    term: dto.Term,
    opensAtUtc: dto.OpensAtUtc,
    closesAtUtc: dto.ClosesAtUtc,
    status: dto.Status as SessionStatus,
    notes: dto.Notes,
    createdBy: dto.CreatedBy,
    createdAtUtc: dto.CreatedAtUtc,
    updatedAtUtc: dto.UpdatedAtUtc,
    submissionCount: dto.SubmissionCount,
    isAvailableNow: dto.IsAvailableNow,
  };
}

function toSubmission(dto: SubmissionDto): SessionSubmission {
  return {
    submissionId: dto.SubmissionId,
    studentId: dto.StudentId,
    studentName: dto.StudentName,
    studentNumber: dto.StudentNumber,
    subjectCode: dto.SubjectCode,
    teacherName: dto.TeacherName,
    submittedAtUtc: dto.SubmittedAtUtc,
  };
}

export const sessionService = {
  async getSessions(): Promise<Session[]> {
    const { data } = await api.get<SessionDto[]>("/api/evaluation/sessions");
    return data.map(toSession);
  },

  async getSession(id: number): Promise<Session> {
    const { data } = await api.get<SessionDto>(
      `/api/evaluation/sessions/${id}`,
    );
    return toSession(data);
  },

  async createSession(input: CreateSessionInput): Promise<Session> {
    const { data } = await api.post<SessionDto>(
      "/api/evaluation/sessions",
      {
        FormId: input.formId,
        SchoolYear: input.schoolYear,
        Term: input.term,
        OpensAtUtc: input.opensAtUtc,
        ClosesAtUtc: input.closesAtUtc,
        Notes: input.notes,
      },
    );
    return toSession(data);
  },

  async updateSession(
    id: number,
    input: UpdateSessionInput,
  ): Promise<Session> {
    const { data } = await api.put<SessionDto>(
      `/api/evaluation/sessions/${id}`,
      {
        Status: input.status,
        OpensAtUtc: input.opensAtUtc,
        ClosesAtUtc: input.closesAtUtc,
        Notes: input.notes,
      },
    );
    return toSession(data);
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
