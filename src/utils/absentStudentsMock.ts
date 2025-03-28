
import { getAbsentStudents } from './mockData';

// Define the type for parent information
export interface ParentInfo {
  name: string;
  phone: string;
  email: string;
}

// Define the AbsentStudent type
export interface AbsentStudent {
  id: string;
  name: string;
  grade: string;
  class: string;
  absenceRate: number;
  lastAttendance: string;
  parent: ParentInfo;
}

// Transform and export absent students data
export const absentStudents: AbsentStudent[] = getAbsentStudents().map(student => {
  const className = student.grade === "Pre-K" ? "Pre-K" : 
                   student.grade === "Kindergarten" ? "Kindergarten" : 
                   `${student.grade} Grade`;
  
  // Extract first name from parent's full name for email generation
  const parentFirstName = student.parentName.split(' ')[0].toLowerCase();
  const familyName = student.parentName.split(' ')[1].toLowerCase();
  
  return {
    id: student.id,
    name: student.name,
    grade: student.grade,
    class: className,
    absenceRate: 100 - student.attendanceRate, // Invert attendance rate to get absence rate
    lastAttendance: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    parent: {
      name: student.parentName,
      phone: student.phone,
      email: `${parentFirstName}.${familyName}@example.com`
    }
  };
});
