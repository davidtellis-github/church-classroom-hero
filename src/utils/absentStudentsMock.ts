
export interface AbsentStudent {
  id: string;
  name: string;
  age: number;
  grade: string;
  class: string;
  absenceRate: number;
  lastAttendance: string;
  parent: {
    name: string;
    phone: string;
    email: string;
  };
}

// Students who have been absent for more than 95% of classes
export const absentStudents: AbsentStudent[] = [
  {
    id: "STU1024",
    name: "Emma Thompson",
    age: 7,
    grade: "2nd Grade",
    class: "Class B",
    absenceRate: 96,
    lastAttendance: "2023-04-12",
    parent: {
      name: "Michael Thompson",
      phone: "(555) 123-4567",
      email: "mthompson@example.com"
    }
  },
  {
    id: "STU1042",
    name: "Noah Martinez",
    age: 9,
    grade: "3rd Grade",
    class: "Class A",
    absenceRate: 98,
    lastAttendance: "2023-03-28",
    parent: {
      name: "Sofia Martinez",
      phone: "(555) 987-6543",
      email: "smartinez@example.com"
    }
  },
  {
    id: "STU1078",
    name: "Olivia Johnson",
    age: 6,
    grade: "1st Grade",
    class: "Class C",
    absenceRate: 95,
    lastAttendance: "2023-04-22",
    parent: {
      name: "David Johnson",
      phone: "(555) 456-7890",
      email: "djohnson@example.com"
    }
  },
  {
    id: "STU1102",
    name: "Liam Wilson",
    age: 8,
    grade: "2nd Grade",
    class: "Class B",
    absenceRate: 97,
    lastAttendance: "2023-04-05",
    parent: {
      name: "Jessica Wilson",
      phone: "(555) 789-0123",
      email: "jwilson@example.com"
    }
  }
];
