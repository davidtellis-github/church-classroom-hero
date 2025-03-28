
// Mock data for classes and students
import { v4 as uuidv4 } from 'uuid';

// Define types for our mock data
export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  parentName: string;
  phone: string;
  classId: string;
  attendanceRate: number;
}

export interface Class {
  id: string;
  name: string;
  location: string;
  day: string;
  time: string;
  teacherName: string;
  studentCount: number;
}

// Generate random names
const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", 
  "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", 
  "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Daniel", 
  "Nancy", "Matthew", "Lisa", "Anthony", "Margaret", "Mark", "Betty", 
  "Donald", "Sandra", "Steven", "Ashley", "Paul", "Dorothy", "Andrew", 
  "Kimberly", "Joshua", "Emily", "Kenneth", "Donna", "Kevin", "Michelle",
  "Brian", "Carol", "George", "Amanda", "Emma", "Noah", "Olivia", "Liam",
  "Ava", "Sophia", "Jackson", "Isabella", "Aiden", "Mia", "Lucas"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", 
  "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", 
  "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", 
  "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "King", 
  "Wright", "Scott", "Green", "Baker", "Adams", "Nelson", "Hill", "Perez", 
  "Campbell", "Mitchell", "Roberts", "Carter", "Phillips", "Evans", "Turner",
  "Chen", "Wang", "Li", "Zhang", "Liu", "Yang", "Huang", "Zhao", "Wu"
];

// Generate random phone number
const generatePhone = () => {
  return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
};

// Generate random name
const generateName = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

// Generate a class
const generateClass = (index: number): Class => {
  const classLevels = ["Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade"];
  const days = ["Sunday", "Wednesday"];
  const times = ["9:00 AM", "10:30 AM", "6:00 PM", "7:00 PM"];
  const level = classLevels[Math.floor(index / 2) % classLevels.length];
  const letter = String.fromCharCode(65 + (index % 6));
  
  return {
    id: `CLS${1000 + index}`,
    name: `${level} Class ${letter}`,
    location: `Room ${100 + index}`,
    day: days[index % days.length],
    time: times[index % times.length],
    teacherName: generateName(),
    studentCount: 0, // Will be calculated later
  };
};

// Generate a student
const generateStudent = (classId: string, classLevel: string, index: number): Student => {
  // Determine age based on class level
  let age: number;
  switch (classLevel.split(' ')[0]) {
    case "Pre-K": age = 4 + Math.floor(Math.random() * 2); break;
    case "Kindergarten": age = 5 + Math.floor(Math.random() * 2); break;
    case "1st": age = 6 + Math.floor(Math.random() * 2); break;
    case "2nd": age = 7 + Math.floor(Math.random() * 2); break;
    case "3rd": age = 8 + Math.floor(Math.random() * 2); break;
    default: age = 5 + Math.floor(Math.random() * 8);
  }

  // Generate random attendance rate - most students have good attendance
  let attendanceRate: number;
  const rnd = Math.random();
  if (rnd < 0.7) { // 70% of students have great attendance
    attendanceRate = 85 + Math.floor(Math.random() * 16); // 85-100%
  } else if (rnd < 0.9) { // 20% have medium attendance
    attendanceRate = 70 + Math.floor(Math.random() * 15); // 70-85%
  } else { // 10% have poor attendance
    attendanceRate = 40 + Math.floor(Math.random() * 30); // 40-70%
  }

  const studentName = generateName();
  const parentName = `${generateName().split(' ')[0]} ${studentName.split(' ')[1]}`;

  return {
    id: `STU${10000 + index}`,
    name: studentName,
    age,
    grade: classLevel.split(' ')[0],
    parentName,
    phone: generatePhone(),
    classId,
    attendanceRate,
  };
};

// Generate 5 classes with 100 students each
export const generateMockData = () => {
  const classes: Class[] = [];
  const students: Student[] = [];
  
  // Generate 5 classes
  for (let i = 0; i < 5; i++) {
    classes.push(generateClass(i));
  }
  
  // Generate 100 students for each class
  let studentIndex = 0;
  for (let i = 0; i < classes.length; i++) {
    const classObj = classes[i];
    for (let j = 0; j < 100; j++) {
      students.push(generateStudent(classObj.id, classObj.name, studentIndex));
      studentIndex++;
    }
    classObj.studentCount = 100;
  }
  
  return { classes, students };
};

// Create the mock data once and export it
export const mockData = generateMockData();

// Get students with attendance issues (less than 60%)
export const getAbsentStudents = () => {
  return mockData.students.filter(student => student.attendanceRate < 60);
};

// Get highly absent students (less than 5% attendance)
export const getCriticalAbsentStudents = () => {
  return mockData.students.filter(student => student.attendanceRate < 5);
};

// Calculate average attendance across all students
export const getAverageAttendance = () => {
  const total = mockData.students.reduce((sum, student) => sum + student.attendanceRate, 0);
  return Math.round(total / mockData.students.length);
};

// Calculate attendance stats by class
export const getClassAttendanceStats = () => {
  return mockData.classes.map(cls => {
    const classStudents = mockData.students.filter(student => student.classId === cls.id);
    const totalAttendance = classStudents.reduce((sum, student) => sum + student.attendanceRate, 0);
    const averageAttendance = Math.round(totalAttendance / classStudents.length);
    
    return {
      id: cls.id,
      name: cls.name,
      attendance: averageAttendance,
    };
  });
};
