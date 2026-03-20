// src/hooks/index.ts
/**
 * Экспорт всех хуков
 */

export { useAuth } from './useAuth'
export { usePagination } from './usePagination'
export { useTable } from './useTable'
export { useConfirm, useConfirmWithId } from './useConfirm'
export { useNotification } from './useNotification'
export { useTagList } from './useTagList'
export { useCourseList } from './useCourseList'
export { useLessonList } from './useLessonList'
export { useUserList } from './useUserList'
export { useAvatarUpload } from './useAvatarUpload'
export { useAuthorApplication } from './useAuthorApplication'
export { useAuthorCourses } from './useAuthorCourses'
export { useAuthorLessons } from './useAuthorLessons'
export { useAuthorCourse } from './useAuthorCourse'
export { useAuthorLesson } from './useAuthorLesson'
export { useLessonContent, type TextContent, type VideoContent, type AudioContent, type QuizContent, type QuizQuestion } from './useLessonContent'
export { useCourseModules, type CourseModule } from './useCourseModules'
export { useTagOptions } from './useTagOptions'
export { useCourseCatalog } from './useCourseCatalog'
export { useCourseDetail } from './useCourseDetail'
export type { AuthorApplication, ApplicationStatus } from './useAuthorApplication'
export type { AuthorCourse } from './useAuthorCourses'
export type { AuthorLesson } from './useAuthorLessons'
