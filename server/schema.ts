import { z } from 'zod';

export const CourseOutcomeSchema = z.object({
  code: z.string().default('CO1'),
  statement: z.string().min(5),
  leadingVerb: z.string().default('Apply'),
  bloomsLevel: z.enum(['L1', 'L2', 'L3', 'L4', 'L5', 'L6']).default('L3'),
  targetAttainment: z.number().min(0).max(100).default(75)
});

export const UnitModuleSchema = z.object({
  unitNo: z.number().min(1),
  title: z.string().min(2),
  content: z.string().min(5),
  hours: z.number().min(1).default(12),
  bloomFocus: z.string().default('L3 (Applying)'),
  outcomesAddressed: z.array(z.string()).default([])
});

export const TeachingHoursRowSchema = z.object({
  component: z.string(), // e.g. "Lectures", "Tutorials", "Laboratory", "Self-Study"
  allocatedHours: z.number(),
  pedagogy: z.string().default('Classroom / Lab')
});

export const AssessmentRowSchema = z.object({
  instrument: z.string(), // e.g. "Continuous Internal Assessment 1", "Semester End Exam"
  weightPercentage: z.number(),
  targetBloomsLevels: z.array(z.string()).default([])
});

export const ParsedCourseSpecificationSchema = z.object({
  courseCode: z.string().min(2),
  title: z.string().min(2),
  department: z.string().default('Computer Science and Engineering'),
  credits: z.string().default('3:0:2'), // formatted as L:T:P
  creditsStructured: z.object({
    L: z.number().default(3),
    T: z.number().default(0),
    P: z.number().default(2),
    C: z.number().default(4)
  }).default({ L: 3, T: 0, P: 2, C: 4 }),
  courseType: z.string().default('Professional Core'),
  description: z.string().default(''),
  courseOutcomes: z.array(CourseOutcomeSchema).min(1),
  units: z.array(UnitModuleSchema).min(1),
  coPoMap: z.record(z.string(), z.record(z.string(), z.number())).default({}),
  teachingHoursTable: z.array(TeachingHoursRowSchema).default([]),
  assessmentTable: z.array(AssessmentRowSchema).default([]),
  resources: z.object({
    textbooks: z.array(z.string()).default([]),
    referenceBooks: z.array(z.string()).default([]),
    webResources: z.array(z.string()).default([])
  }).default({ textbooks: [], referenceBooks: [], webResources: [] })
});

export type ParsedCourseSpecification = z.infer<typeof ParsedCourseSpecificationSchema>;
export type CourseOutcomeItem = z.infer<typeof CourseOutcomeSchema>;
export type UnitModuleItem = z.infer<typeof UnitModuleSchema>;
