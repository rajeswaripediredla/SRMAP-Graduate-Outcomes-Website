// TypeScript Typings for the GO Management System

export type UserRole = 'student' | 'faculty' | 'hod' | 'admin' | 'public';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  regNo?: string;
  designation?: string;
  avatar?: string;
  batch?: string;
  phone?: string;
  program?: string;
  gradYear?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
}

export type AchievementCategory = 'certification' | 'internship' | 'placement' | 'publication' | 'higher_studies';

export interface Achievement {
  id: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  department: string;
  category: AchievementCategory;
  title: string;
  issuer: string;
  date: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  goMapping: string[]; // e.g., ["GO-1", "GO-3"]
  status: 'pending' | 'verified' | 'rejected';
  verificationDate?: string;
  verifiedBy?: string;
  comments?: string;
  details?: Record<string, string>; // Extra dynamic details like package, journal name, etc.
}

export interface GraduateOutcome {
  code: string;
  title: string;
  description: string;
  threshold: number; // target percentage, e.g., 75%
  attainmentCSE: number; // actual attainment CSE
  attainmentECE: number; // actual attainment ECE
  attainmentME: number;  // actual attainment ME
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  studentCount: number;
  facultyCount: number;
  avgAttainment: number; // overall outcome attainment percentage
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  ipAddress: string;
}

export interface Notification {
  id: string;
  recipientRole: UserRole | 'all';
  recipientId?: string; // specific user if any
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'verification' | 'announcement' | 'system';
}

// ==========================================
// MOCK DATASETS
// ==========================================

export const mockUsers: User[] = [
  {
    id: 'usr_student',
    name: 'Aarav Pediredla',
    email: 'student@srmap.edu.in',
    role: 'student',
    department: 'Computer Science & Engineering',
    regNo: 'AP21110010245',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    batch: 'Class of 2026',
    phone: '+91 98765 43210',
    program: 'Bachelor of Technology (B.Tech)',
    gradYear: '2026',
    phoneVerified: false,
    emailVerified: true
  },
  {
    id: 'usr_faculty',
    name: 'Dr. Rajeshwari K.',
    email: 'faculty@srmap.edu.in',
    role: 'faculty',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    phone: '+91 91234 56789',
    program: 'Postgraduate & Research',
    gradYear: 'N/A',
    phoneVerified: true,
    emailVerified: true
  },
  {
    id: 'usr_hod',
    name: 'Dr. Murali Krishna S.',
    email: 'hod@srmap.edu.in',
    role: 'hod',
    department: 'Computer Science & Engineering',
    designation: 'Head of Department',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    phone: '+91 90123 45678',
    program: 'CSE Administration',
    gradYear: 'N/A',
    phoneVerified: true,
    emailVerified: true
  },
  {
    id: 'usr_admin',
    name: 'Srikanth T.',
    email: 'admin@srmap.edu.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    phone: '+91 89012 34567',
    program: 'IT Operations',
    gradYear: 'N/A',
    phoneVerified: true,
    emailVerified: true
  }
];

export const mockGraduateOutcomes: GraduateOutcome[] = [
  {
    code: 'GO-1',
    title: 'Engineering Knowledge',
    description: 'Apply knowledge of mathematics, science, engineering fundamentals, and computer science to solve complex problems.',
    threshold: 80,
    attainmentCSE: 84,
    attainmentECE: 79,
    attainmentME: 75
  },
  {
    code: 'GO-2',
    title: 'Problem Analysis',
    description: 'Identify, formulate, and analyze complex engineering problems reaching substantiated conclusions using mathematical principles.',
    threshold: 75,
    attainmentCSE: 78,
    attainmentECE: 72,
    attainmentME: 68
  },
  {
    code: 'GO-3',
    title: 'Design & Development',
    description: 'Design solutions for complex engineering problems and design system components or processes that meet public health and safety needs.',
    threshold: 75,
    attainmentCSE: 81,
    attainmentECE: 74,
    attainmentME: 72
  },
  {
    code: 'GO-4',
    title: 'Conduct Investigations',
    description: 'Use research-based knowledge and research methods including design of experiments, analysis, and interpretation of data.',
    threshold: 70,
    attainmentCSE: 72,
    attainmentECE: 68,
    attainmentME: 65
  },
  {
    code: 'GO-5',
    title: 'Modern Tool Usage',
    description: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling.',
    threshold: 80,
    attainmentCSE: 88,
    attainmentECE: 82,
    attainmentME: 78
  },
  {
    code: 'GO-6',
    title: 'Engineer & Society',
    description: 'Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues.',
    threshold: 70,
    attainmentCSE: 75,
    attainmentECE: 71,
    attainmentME: 73
  }
];

export const mockDepartments: Department[] = [
  {
    id: 'dept_cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hod: 'Dr. Murali Krishna S.',
    studentCount: 720,
    facultyCount: 42,
    avgAttainment: 81.3
  },
  {
    id: 'dept_ece',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    hod: 'Dr. V. S. Rao',
    studentCount: 380,
    facultyCount: 22,
    avgAttainment: 74.3
  },
  {
    id: 'dept_me',
    name: 'Mechanical Engineering',
    code: 'ME',
    hod: 'Dr. Prasad G.',
    studentCount: 240,
    facultyCount: 16,
    avgAttainment: 71.8
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach_1',
    studentId: 'usr_student',
    studentName: 'Aarav Pediredla',
    studentRegNo: 'AP21110010245',
    department: 'Computer Science & Engineering',
    category: 'certification',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2026-03-12',
    fileUrl: '#',
    fileName: 'aws_solutions_architect.pdf',
    fileSize: '1.4 MB',
    goMapping: ['GO-1', 'GO-5'],
    status: 'verified',
    verificationDate: '2026-03-20',
    verifiedBy: 'Dr. Rajeshwari K.',
    comments: 'Excellent certification aligning well with Modern Tool Usage guidelines.',
    details: {
      'Credential ID': 'AWS-ASA-99238',
      'Valid Until': '2029-03-12'
    }
  },
  {
    id: 'ach_2',
    studentId: 'usr_student',
    studentName: 'Aarav Pediredla',
    studentRegNo: 'AP21110010245',
    department: 'Computer Science & Engineering',
    category: 'internship',
    title: 'Software Engineering Intern',
    issuer: 'Google India',
    date: '2026-05-15',
    fileUrl: '#',
    fileName: 'google_internship_certificate.pdf',
    fileSize: '2.1 MB',
    goMapping: ['GO-3', 'GO-5'],
    status: 'verified',
    verificationDate: '2026-06-01',
    verifiedBy: 'Dr. Rajeshwari K.',
    comments: 'Industry-standard internship. Demonstrated design & development skills in a real-world system.',
    details: {
      'Duration': '10 Weeks',
      'Team': 'Google Cloud Core'
    }
  },
  {
    id: 'ach_3',
    studentId: 'usr_student',
    studentName: 'Aarav Pediredla',
    studentRegNo: 'AP21110010245',
    department: 'Computer Science & Engineering',
    category: 'publication',
    title: 'Distributed Blockchain Consensus Optimization',
    issuer: 'IEEE International Conference',
    date: '2026-04-10',
    fileUrl: '#',
    fileName: 'ieee_distributed_consensus.pdf',
    fileSize: '3.4 MB',
    goMapping: ['GO-2', 'GO-4'],
    status: 'pending',
    details: {
      'Conference/Journal': 'IEEE Cluster 2026',
      'Authors': 'Aarav Pediredla, Dr. Rajeshwari K.'
    }
  },
  {
    id: 'ach_4',
    studentId: 'usr_student',
    studentName: 'Aarav Pediredla',
    studentRegNo: 'AP21110010245',
    department: 'Computer Science & Engineering',
    category: 'placement',
    title: 'Associate Software Engineer Offer',
    issuer: 'Microsoft Corporation',
    date: '2026-06-18',
    fileUrl: '#',
    fileName: 'microsoft_offer_letter.pdf',
    fileSize: '1.8 MB',
    goMapping: ['GO-1', 'GO-3'],
    status: 'pending',
    details: {
      'Role': 'Software Engineer',
      'Compensation': '44.5 LPA'
    }
  },
  {
    id: 'ach_5',
    studentId: 'usr_student_2',
    studentName: 'Nisha Sharma',
    studentRegNo: 'AP21110010312',
    department: 'Computer Science & Engineering',
    category: 'higher_studies',
    title: 'M.S. in Computer Science Admit',
    issuer: 'Carnegie Mellon University',
    date: '2026-05-02',
    fileUrl: '#',
    fileName: 'cmu_admit_letter.pdf',
    fileSize: '1.2 MB',
    goMapping: ['GO-1', 'GO-4'],
    status: 'verified',
    verificationDate: '2026-05-10',
    verifiedBy: 'Dr. Murali Krishna S.',
    comments: 'Superb academic milestone at a top institution.',
    details: {
      'Term': 'Fall 2026',
      'Program': 'Master of Science in Computer Science'
    }
  },
  {
    id: 'ach_6',
    studentId: 'usr_student_3',
    studentName: 'Karthik Rao',
    studentRegNo: 'AP21110020042',
    department: 'Electronics & Communication Engineering',
    category: 'certification',
    title: 'Embedded Systems & VLSI Design Academy',
    issuer: 'Intel Corporation',
    date: '2026-02-14',
    fileUrl: '#',
    fileName: 'intel_vlsi_academy.pdf',
    fileSize: '2.5 MB',
    goMapping: ['GO-1', 'GO-5'],
    status: 'rejected',
    verificationDate: '2026-02-28',
    verifiedBy: 'Dr. V. S. Rao',
    comments: 'Uploaded certificate is missing the signature of the issuing authority. Please upload a signed copy.',
    details: {
      'Course': 'VLSI Physical Design',
      'Grade': 'A+'
    }
  },
  {
    id: 'ach_7',
    studentId: 'usr_student_4',
    studentName: 'Sanjana Sen',
    studentRegNo: 'AP21110030018',
    department: 'Mechanical Engineering',
    category: 'internship',
    title: 'Production Planning & Operations Intern',
    issuer: 'Tata Motors',
    date: '2026-04-20',
    fileUrl: '#',
    fileName: 'tata_motors_internship.pdf',
    fileSize: '2.2 MB',
    goMapping: ['GO-3', 'GO-6'],
    status: 'verified',
    verificationDate: '2026-05-05',
    verifiedBy: 'Dr. Prasad G.',
    comments: 'Good project demonstrating mechanical design elements and safety outcomes.',
    details: {
      'Location': 'Pune Plant',
      'Department': 'Assembly Line Automation'
    }
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'not_1',
    recipientRole: 'student',
    recipientId: 'usr_student',
    title: 'Certification Approved',
    message: 'Your certification "AWS Certified Solutions Architect" has been successfully verified.',
    timestamp: '2026-06-25T09:00:00Z',
    isRead: false,
    category: 'verification'
  },
  {
    id: 'not_2',
    recipientRole: 'faculty',
    title: 'New Verification Requests',
    message: 'You have 2 new student submissions waiting in your queue.',
    timestamp: '2026-06-25T08:30:00Z',
    isRead: false,
    category: 'verification'
  },
  {
    id: 'not_3',
    recipientRole: 'all',
    title: 'NBA Accreditation Visit Schedule',
    message: 'The NBA Mock Committee will visit the department on July 5th. Ensure all student portfolio files are up to date.',
    timestamp: '2026-06-24T12:00:00Z',
    isRead: false,
    category: 'announcement'
  },
  {
    id: 'not_4',
    recipientRole: 'student',
    recipientId: 'usr_student',
    title: 'Upload Rejected',
    message: 'Your certificate for "VLSI Design Academy" was rejected by Dr. V. S. Rao due to a missing signature.',
    timestamp: '2026-06-23T15:20:00Z',
    isRead: true,
    category: 'verification'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log_1',
    timestamp: '2026-06-25T10:20:12Z',
    userId: 'usr_student',
    userName: 'Aarav Pediredla',
    role: 'student',
    action: 'Uploaded Placement Offer (Microsoft Corporation)',
    ipAddress: '172.16.42.109'
  },
  {
    id: 'log_2',
    timestamp: '2026-06-25T09:12:45Z',
    userId: 'usr_faculty',
    userName: 'Dr. Rajeshwari K.',
    role: 'faculty',
    action: 'Verified Certification (AWS Solutions Architect - Aarav P.)',
    ipAddress: '172.16.45.2'
  },
  {
    id: 'log_3',
    timestamp: '2026-06-24T16:40:02Z',
    userId: 'usr_hod',
    userName: 'Dr. Murali Krishna S.',
    role: 'hod',
    action: 'Downloaded CSE Department Attainment Report (PDF)',
    ipAddress: '172.16.40.1'
  },
  {
    id: 'log_4',
    timestamp: '2026-06-24T11:05:30Z',
    userId: 'usr_admin',
    userName: 'Srikanth T.',
    role: 'admin',
    action: 'Modified Attainment Threshold for GO-1 from 75% to 80%',
    ipAddress: '172.16.12.54'
  }
];

// Placement statistics for public portal
export const placementStats = {
  averagePackage: '12.8 LPA',
  highestPackage: '44.5 LPA',
  placementPercentage: '97.2%',
  companiesVisited: '240+',
  packagesRange: [
    { range: '0-5 LPA', count: 42 },
    { range: '5-10 LPA', count: 184 },
    { range: '10-15 LPA', count: 215 },
    { range: '15-20 LPA', count: 98 },
    { range: '20+ LPA', count: 56 }
  ],
  yearWiseTrends: [
    { year: '2022', average: 7.2, highest: 32.0 },
    { year: '2023', average: 8.9, highest: 38.5 },
    { year: '2024', average: 9.8, highest: 42.0 },
    { year: '2025', average: 11.4, highest: 44.0 },
    { year: '2026', average: 12.8, highest: 44.5 }
  ]
};

// Success stories
export const successStories = [
  {
    id: 1,
    name: 'Sai Kiran Tumati',
    department: 'CSE',
    batch: 'Class of 2025',
    destination: 'Software Engineer @ Microsoft Redmond',
    achievement: 'Secured full-time international placement, publishing 2 IEEE papers in Blockchain security.',
    outcomes: ['GO-1', 'GO-3', 'GO-5'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    department: 'ECE',
    batch: 'Class of 2025',
    destination: 'Ph.D. Candidate @ Stanford University',
    achievement: 'Received fully-funded Ph.D. offer in Nano-electronics with multiple journal publications.',
    outcomes: ['GO-1', 'GO-4'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 3,
    name: 'Vikas Kumar',
    department: 'ME',
    batch: 'Class of 2024',
    destination: 'R&D Engineer @ Tesla India',
    achievement: 'Designed automated chassis cooling module during a 6-month internship, converted to PPO.',
    outcomes: ['GO-3', 'GO-5'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
  }
];
