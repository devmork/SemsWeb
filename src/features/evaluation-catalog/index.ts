export { CategoryManagement } from "./components/CategoryManagement";
export { CategoryTable } from "./components/CategoryTable";
export { CategoryDialog } from "./components/CategoryDialog";
export { DeleteCategoryDialog } from "./components/DeleteCategoryDialog";

export { QuestionManagement } from "./components/QuestionManagement";
export { QuestionTable } from "./components/QuestionTable";
export { QuestionDialog } from "./components/QuestionDialog";
export { DeleteQuestionDialog } from "./components/DeleteQuestionDialog";

export {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  categoryKeys,
} from "./hooks/useCategories";
export {
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  questionKeys,
} from "./hooks/useQuestions";

export { categoryService } from "./services/categoryService";
export { questionService } from "./services/questionService";

export type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  Question,
  CreateQuestionInput,
  UpdateQuestionInput,
} from "./types";
