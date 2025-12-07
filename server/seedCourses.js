import Course from './models/courseModel.js';
import sequelize from './config/database.js';
import User from './models/userModel.js';

const seedCourses = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await sequelize.sync({ force: false });

    // ✅ Create users WITHOUT pre-hashing - let the model hooks do it
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: 'admin@aucegypt.edu' },
      defaults: {
        name: 'Admin User',
        email: 'admin@aucegypt.edu',
        studentId: 'ADMIN001',
        department: 'Administration',
        yearLevel: '4',
        password: 'password123', // ✅ Plain text - model will hash it
        isAccountVerified: true,
        role: 'admin',
        maxCreditsPerSemester: 18
      }
    });
    
    if (adminCreated) {
      console.log('✅ Admin user created:', admin.email);
    } else {
      console.log('⏭️  Admin user already exists');
    }

    // Create Student User
    const [student, studentCreated] = await User.findOrCreate({
      where: { email: 'student@aucegypt.edu' },
      defaults: {
        name: 'John Doe',
        email: 'student@aucegypt.edu',
        studentId: '2021001',
        department: 'Computer Science',
        yearLevel: '2',
        password: 'password123', // ✅ Plain text - model will hash it
        isAccountVerified: true,
        role: 'student',
        maxCreditsPerSemester: 18
      }
    });
    
    if (studentCreated) {
      console.log('✅ Student user created:', student.email);
    } else {
      console.log('⏭️  Student user already exists');
    }

    console.log('Starting to seed courses...\n');

const sampleCourses = [
  // Computer Science Courses
  {
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    description: 'Fundamental concepts of computer science, programming basics, problem-solving, and algorithm design',
    credits: 3,
    department: 'Computer Science',
    level: '100',
    instructor: 'Dr. John Smith',
    maxCapacity: 40,
    currentEnrollment: 25,
    schedule: 'MWF 10:00-11:00',
    room: 'CS Building 201',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'CS102',
    courseName: 'Programming Fundamentals',
    description: 'Introduction to programming using Python, covering variables, loops, functions, and basic data structures',
    credits: 4,
    department: 'Computer Science',
    level: '100',
    instructor: 'Prof. Sarah Johnson',
    maxCapacity: 35,
    currentEnrollment: 30,
    schedule: 'TTh 09:00-11:00',
    room: 'CS Building 105',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'CS201',
    courseName: 'Data Structures and Algorithms',
    description: 'Advanced data structures including trees, graphs, heaps. Algorithm analysis and design patterns',
    credits: 4,
    department: 'Computer Science',
    level: '200',
    instructor: 'Dr. Jane Doe',
    maxCapacity: 35,
    currentEnrollment: 35,
    schedule: 'TTh 14:00-16:00',
    room: 'CS Building 305',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'CS101',
    isActive: true
  },
  {
    courseCode: 'CS202',
    courseName: 'Object-Oriented Programming',
    description: 'OOP concepts using Java: classes, inheritance, polymorphism, design patterns, and software engineering principles',
    credits: 3,
    department: 'Computer Science',
    level: '200',
    instructor: 'Prof. Michael Chen',
    maxCapacity: 30,
    currentEnrollment: 22,
    schedule: 'MWF 13:00-14:00',
    room: 'CS Building 210',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'CS102',
    isActive: true
  },
  {
    courseCode: 'CS301',
    courseName: 'Database Systems',
    description: 'Relational database design, SQL, normalization, transactions, and database management systems',
    credits: 3,
    department: 'Computer Science',
    level: '300',
    instructor: 'Dr. Emily Rodriguez',
    maxCapacity: 32,
    currentEnrollment: 28,
    schedule: 'MW 15:00-16:30',
    room: 'CS Building 401',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'CS201',
    isActive: true
  },
  {
    courseCode: 'CS302',
    courseName: 'Web Development',
    description: 'Modern web development with HTML, CSS, JavaScript, React, Node.js, and full-stack application design',
    credits: 4,
    department: 'Computer Science',
    level: '300',
    instructor: 'Prof. David Kim',
    maxCapacity: 28,
    currentEnrollment: 20,
    schedule: 'TTh 10:00-12:00',
    room: 'CS Building 308',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'CS201',
    isActive: true
  },
  {
    courseCode: 'CS401',
    courseName: 'Artificial Intelligence',
    description: 'AI fundamentals including search algorithms, machine learning, neural networks, and natural language processing',
    credits: 3,
    department: 'Computer Science',
    level: '400',
    instructor: 'Dr. Lisa Wang',
    maxCapacity: 25,
    currentEnrollment: 18,
    schedule: 'MW 16:00-17:30',
    room: 'CS Building 501',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'CS301',
    isActive: true
  },
  {
    courseCode: 'CS402',
    courseName: 'Software Engineering',
    description: 'Software development lifecycle, Agile methodologies, version control, testing, and project management',
    credits: 3,
    department: 'Computer Science',
    level: '400',
    instructor: 'Prof. Robert Taylor',
    maxCapacity: 30,
    currentEnrollment: 25,
    schedule: 'TTh 13:00-14:30',
    room: 'CS Building 405',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'CS301',
    isActive: true
  },

  // Mathematics Courses
  {
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    description: 'Limits, derivatives, applications of derivatives, and introduction to integration',
    credits: 4,
    department: 'Mathematics',
    level: '100',
    instructor: 'Prof. Alice Johnson',
    maxCapacity: 50,
    currentEnrollment: 45,
    schedule: 'MWF 09:00-10:00',
    room: 'Math Building 101',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'MATH102',
    courseName: 'Calculus II',
    description: 'Integration techniques, sequences, series, parametric equations, and polar coordinates',
    credits: 4,
    department: 'Mathematics',
    level: '100',
    instructor: 'Dr. James Wilson',
    maxCapacity: 45,
    currentEnrollment: 38,
    schedule: 'MWF 11:00-12:00',
    room: 'Math Building 102',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'MATH101',
    isActive: true
  },
  {
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    description: 'Vectors, matrices, linear transformations, eigenvalues, and applications to computer graphics',
    credits: 3,
    department: 'Mathematics',
    level: '200',
    instructor: 'Prof. Maria Garcia',
    maxCapacity: 40,
    currentEnrollment: 32,
    schedule: 'TTh 10:00-11:30',
    room: 'Math Building 205',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'MATH101',
    isActive: true
  },
  {
    courseCode: 'MATH202',
    courseName: 'Discrete Mathematics',
    description: 'Logic, set theory, combinatorics, graph theory, and applications to computer science',
    credits: 3,
    department: 'Mathematics',
    level: '200',
    instructor: 'Dr. Thomas Anderson',
    maxCapacity: 35,
    currentEnrollment: 28,
    schedule: 'MW 14:00-15:30',
    room: 'Math Building 210',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'MATH301',
    courseName: 'Differential Equations',
    description: 'First and second-order differential equations, systems of equations, and applications',
    credits: 3,
    department: 'Mathematics',
    level: '300',
    instructor: 'Prof. Susan Lee',
    maxCapacity: 30,
    currentEnrollment: 22,
    schedule: 'TTh 13:00-14:30',
    room: 'Math Building 305',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'MATH102',
    isActive: true
  },
  {
    courseCode: 'MATH401',
    courseName: 'Advanced Statistics',
    description: 'Hypothesis testing, regression analysis, ANOVA, and statistical computing',
    credits: 3,
    department: 'Mathematics',
    level: '400',
    instructor: 'Dr. Richard Brown',
    maxCapacity: 28,
    currentEnrollment: 20,
    schedule: 'MW 15:00-16:30',
    room: 'Math Building 401',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'MATH201',
    isActive: true
  },

  // Physics Courses
  {
    courseCode: 'PHYS101',
    courseName: 'General Physics I',
    description: 'Mechanics, motion, forces, energy, and momentum with laboratory component',
    credits: 4,
    department: 'Physics',
    level: '100',
    instructor: 'Dr. Sarah Wilson',
    maxCapacity: 40,
    currentEnrollment: 35,
    schedule: 'MWF 08:00-09:00',
    room: 'Science Building 101',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'PHYS102',
    courseName: 'General Physics II',
    description: 'Electricity, magnetism, waves, optics, and modern physics with laboratory',
    credits: 4,
    department: 'Physics',
    level: '100',
    instructor: 'Prof. Daniel Martinez',
    maxCapacity: 38,
    currentEnrollment: 30,
    schedule: 'MWF 10:00-11:00',
    room: 'Science Building 102',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'PHYS101',
    isActive: true
  },
  {
    courseCode: 'PHYS201',
    courseName: 'Physics for Engineers',
    description: 'Mechanics, thermodynamics, and waves with engineering applications',
    credits: 4,
    department: 'Physics',
    level: '200',
    instructor: 'Dr. Jennifer Clark',
    maxCapacity: 40,
    currentEnrollment: 15,
    schedule: 'TTh 13:00-15:00',
    room: 'Science Building 301',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'MATH101',
    isActive: true
  },
  {
    courseCode: 'PHYS301',
    courseName: 'Quantum Mechanics',
    description: 'Introduction to quantum theory, wave functions, Schrödinger equation, and applications',
    credits: 3,
    department: 'Physics',
    level: '300',
    instructor: 'Dr. William Thompson',
    maxCapacity: 25,
    currentEnrollment: 18,
    schedule: 'MW 14:00-15:30',
    room: 'Science Building 405',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'PHYS201',
    isActive: true
  },

  // English Courses
  {
    courseCode: 'ENG101',
    courseName: 'English Composition I',
    description: 'Academic writing, critical thinking, research methods, and essay composition',
    credits: 3,
    department: 'English',
    level: '100',
    instructor: 'Prof. Elizabeth Moore',
    maxCapacity: 25,
    currentEnrollment: 23,
    schedule: 'TTh 09:00-10:30',
    room: 'Liberal Arts 201',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'ENG102',
    courseName: 'English Composition II',
    description: 'Advanced academic writing, argumentation, and research paper development',
    credits: 3,
    department: 'English',
    level: '100',
    instructor: 'Dr. Robert Brown',
    maxCapacity: 30,
    currentEnrollment: 28,
    schedule: 'TTh 11:00-12:30',
    room: 'Liberal Arts 204',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'ENG101',
    isActive: true
  },
  {
    courseCode: 'ENG201',
    courseName: 'World Literature',
    description: 'Survey of major literary works from different cultures and time periods',
    credits: 3,
    department: 'English',
    level: '200',
    instructor: 'Prof. Margaret Davis',
    maxCapacity: 30,
    currentEnrollment: 20,
    schedule: 'MW 13:00-14:30',
    room: 'Liberal Arts 305',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'ENG101',
    isActive: true
  },
  {
    courseCode: 'ENG301',
    courseName: 'Creative Writing',
    description: 'Fiction and poetry writing workshop with peer review and revision techniques',
    credits: 3,
    department: 'English',
    level: '300',
    instructor: 'Dr. Amanda White',
    maxCapacity: 20,
    currentEnrollment: 15,
    schedule: 'TTh 14:00-15:30',
    room: 'Liberal Arts 408',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'ENG201',
    isActive: true
  },

  // Business Courses
  {
    courseCode: 'BUS101',
    courseName: 'Introduction to Business',
    description: 'Overview of business principles, management, marketing, finance, and entrepreneurship',
    credits: 3,
    department: 'Business',
    level: '100',
    instructor: 'Prof. Mark Johnson',
    maxCapacity: 45,
    currentEnrollment: 40,
    schedule: 'MWF 10:00-11:00',
    room: 'Business Building 101',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'BUS201',
    courseName: 'Financial Accounting',
    description: 'Fundamentals of accounting, financial statements, and accounting principles',
    credits: 3,
    department: 'Business',
    level: '200',
    instructor: 'Dr. Karen Lee',
    maxCapacity: 40,
    currentEnrollment: 35,
    schedule: 'TTh 10:00-11:30',
    room: 'Business Building 205',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'BUS101',
    isActive: true
  },
  {
    courseCode: 'BUS202',
    courseName: 'Marketing Principles',
    description: 'Marketing strategies, consumer behavior, market research, and product development',
    credits: 3,
    department: 'Business',
    level: '200',
    instructor: 'Prof. Steven Harris',
    maxCapacity: 35,
    currentEnrollment: 30,
    schedule: 'MW 14:00-15:30',
    room: 'Business Building 210',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'BUS101',
    isActive: true
  },
  {
    courseCode: 'BUS301',
    courseName: 'Corporate Finance',
    description: 'Financial decision-making, capital budgeting, risk analysis, and investment strategies',
    credits: 3,
    department: 'Business',
    level: '300',
    instructor: 'Dr. Rachel Green',
    maxCapacity: 30,
    currentEnrollment: 25,
    schedule: 'TTh 13:00-14:30',
    room: 'Business Building 305',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'BUS201',
    isActive: true
  },
  {
    courseCode: 'BUS401',
    courseName: 'Strategic Management',
    description: 'Business strategy formulation, competitive analysis, and organizational leadership',
    credits: 3,
    department: 'Business',
    level: '400',
    instructor: 'Prof. Andrew Miller',
    maxCapacity: 28,
    currentEnrollment: 22,
    schedule: 'MW 15:00-16:30',
    room: 'Business Building 401',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'BUS301',
    isActive: true
  },

  // Psychology Courses
  {
    courseCode: 'PSY101',
    courseName: 'Introduction to Psychology',
    description: 'Overview of psychological concepts, research methods, and major theories',
    credits: 3,
    department: 'Psychology',
    level: '100',
    instructor: 'Dr. Jennifer Adams',
    maxCapacity: 50,
    currentEnrollment: 48,
    schedule: 'MWF 11:00-12:00',
    room: 'Social Sciences 101',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'PSY201',
    courseName: 'Developmental Psychology',
    description: 'Human development from infancy through adulthood, cognitive and social development',
    credits: 3,
    department: 'Psychology',
    level: '200',
    instructor: 'Prof. Laura Martinez',
    maxCapacity: 35,
    currentEnrollment: 30,
    schedule: 'TTh 09:00-10:30',
    room: 'Social Sciences 205',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'PSY101',
    isActive: true
  },
  {
    courseCode: 'PSY202',
    courseName: 'Abnormal Psychology',
    description: 'Mental disorders, diagnostic criteria, treatment approaches, and case studies',
    credits: 3,
    department: 'Psychology',
    level: '200',
    instructor: 'Dr. Michael Robinson',
    maxCapacity: 32,
    currentEnrollment: 28,
    schedule: 'MW 13:00-14:30',
    room: 'Social Sciences 210',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'PSY101',
    isActive: true
  },
  {
    courseCode: 'PSY301',
    courseName: 'Cognitive Psychology',
    description: 'Mental processes including perception, memory, language, and problem-solving',
    credits: 3,
    department: 'Psychology',
    level: '300',
    instructor: 'Prof. Sarah Thompson',
    maxCapacity: 30,
    currentEnrollment: 25,
    schedule: 'TTh 11:00-12:30',
    room: 'Social Sciences 305',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'PSY201',
    isActive: true
  },

  // Biology Courses
  {
    courseCode: 'BIO101',
    courseName: 'General Biology I',
    description: 'Cell structure, genetics, evolution, and molecular biology with laboratory',
    credits: 4,
    department: 'Biology',
    level: '100',
    instructor: 'Dr. Patricia Davis',
    maxCapacity: 40,
    currentEnrollment: 38,
    schedule: 'MWF 09:00-10:00',
    room: 'Science Building 201',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'BIO102',
    courseName: 'General Biology II',
    description: 'Ecology, evolution, biodiversity, and plant/animal systems with laboratory',
    credits: 4,
    department: 'Biology',
    level: '100',
    instructor: 'Prof. James Wilson',
    maxCapacity: 38,
    currentEnrollment: 32,
    schedule: 'MWF 11:00-12:00',
    room: 'Science Building 202',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'BIO101',
    isActive: true
  },
  {
    courseCode: 'BIO201',
    courseName: 'Microbiology',
    description: 'Study of microorganisms including bacteria, viruses, fungi with laboratory techniques',
    credits: 4,
    department: 'Biology',
    level: '200',
    instructor: 'Dr. Christine Lee',
    maxCapacity: 30,
    currentEnrollment: 25,
    schedule: 'TTh 10:00-12:00',
    room: 'Science Building 305',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'BIO101',
    isActive: true
  },
  {
    courseCode: 'BIO301',
    courseName: 'Genetics',
    description: 'Mendelian and molecular genetics, gene expression, genetic engineering',
    credits: 3,
    department: 'Biology',
    level: '300',
    instructor: 'Prof. David Martinez',
    maxCapacity: 28,
    currentEnrollment: 22,
    schedule: 'MW 14:00-15:30',
    room: 'Science Building 405',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'BIO201',
    isActive: true
  },

  // Chemistry Courses
  {
    courseCode: 'CHEM101',
    courseName: 'General Chemistry I',
    description: 'Atomic structure, chemical bonding, stoichiometry, and thermochemistry with lab',
    credits: 4,
    department: 'Chemistry',
    level: '100',
    instructor: 'Dr. Robert Anderson',
    maxCapacity: 35,
    currentEnrollment: 32,
    schedule: 'MWF 08:00-09:00',
    room: 'Science Building 105',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'CHEM102',
    courseName: 'General Chemistry II',
    description: 'Chemical kinetics, equilibrium, acids and bases, electrochemistry with lab',
    credits: 4,
    department: 'Chemistry',
    level: '100',
    instructor: 'Prof. Susan Clark',
    maxCapacity: 35,
    currentEnrollment: 28,
    schedule: 'MWF 10:00-11:00',
    room: 'Science Building 106',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'CHEM101',
    isActive: true
  },
  {
    courseCode: 'CHEM201',
    courseName: 'Organic Chemistry I',
    description: 'Structure and reactions of organic compounds, stereochemistry, mechanisms',
    credits: 4,
    department: 'Chemistry',
    level: '200',
    instructor: 'Dr. Michelle Rodriguez',
    maxCapacity: 32,
    currentEnrollment: 30,
    schedule: 'TTh 09:00-11:00',
    room: 'Science Building 205',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'CHEM102',
    isActive: true
  },
  {
    courseCode: 'CHEM301',
    courseName: 'Physical Chemistry',
    description: 'Thermodynamics, quantum mechanics, and spectroscopy in chemical systems',
    credits: 3,
    department: 'Chemistry',
    level: '300',
    instructor: 'Prof. Thomas Wright',
    maxCapacity: 25,
    currentEnrollment: 18,
    schedule: 'MW 13:00-14:30',
    room: 'Science Building 305',
    semester: 'Spring',
    year: 2026,
    prerequisites: 'CHEM201',
    isActive: true
  },

  // History Courses
  {
    courseCode: 'HIST101',
    courseName: 'World History I',
    description: 'Ancient civilizations through the Renaissance, global perspectives',
    credits: 3,
    department: 'History',
    level: '100',
    instructor: 'Prof. George Harris',
    maxCapacity: 40,
    currentEnrollment: 35,
    schedule: 'TTh 10:00-11:30',
    room: 'Liberal Arts 301',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'HIST102',
    courseName: 'World History II',
    description: 'Modern world history from 1500 to present, globalization and cultural exchange',
    credits: 3,
    department: 'History',
    level: '100',
    instructor: 'Dr. Barbara King',
    maxCapacity: 38,
    currentEnrollment: 30,
    schedule: 'TTh 13:00-14:30',
    room: 'Liberal Arts 302',
    semester: 'Spring',
    year: 2026,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'HIST201',
    courseName: 'American History',
    description: 'United States history from colonial period to present, political and social developments',
    credits: 3,
    department: 'History',
    level: '200',
    instructor: 'Prof. Charles Mitchell',
    maxCapacity: 35,
    currentEnrollment: 28,
    schedule: 'MW 11:00-12:30',
    room: 'Liberal Arts 305',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },

  // Economics Courses
  {
    courseCode: 'ECON101',
    courseName: 'Principles of Microeconomics',
    description: 'Supply and demand, market structures, consumer behavior, and resource allocation',
    credits: 3,
    department: 'Economics',
    level: '100',
    instructor: 'Dr. Helen Murphy',
    maxCapacity: 45,
    currentEnrollment: 42,
    schedule: 'MWF 10:00-11:00',
    room: 'Business Building 105',
    semester: 'Fall',
    year: 2025,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'ECON102',
    courseName: 'Principles of Macroeconomics',
    description: 'National income, inflation, unemployment, fiscal and monetary policy',
    credits: 3,
    department: 'Economics',
    level: '100',
    instructor: 'Prof. Richard Nelson',
    maxCapacity: 45,
    currentEnrollment: 38,
    schedule: 'MWF 13:00-14:00',
    room: 'Business Building 106',
    semester: 'Spring',
    year: 2026,
    prerequisites: null,
    isActive: true
  },
  {
    courseCode: 'ECON201',
    courseName: 'International Economics',
    description: 'International trade, exchange rates, globalization, and trade policy',
    credits: 3,
    department: 'Economics',
    level: '200',
    instructor: 'Dr. Angela Turner',
    maxCapacity: 35,
    currentEnrollment: 28,
    schedule: 'TTh 14:00-15:30',
    room: 'Business Building 205',
    semester: 'Fall',
    year: 2025,
    prerequisites: 'ECON101',
    isActive: true
  },

  // Additional Summer Courses
  {
    courseCode: 'CS250',
    courseName: 'Mobile App Development',
    description: 'iOS and Android app development using React Native and Flutter',
    credits: 3,
    department: 'Computer Science',
    level: '200',
    instructor: 'Prof. Kevin Park',
    maxCapacity: 25,
    currentEnrollment: 15,
    schedule: 'MWF 10:00-12:00',
    room: 'CS Building 220',
    semester: 'Summer',
    year: 2026,
    prerequisites: 'CS102',
    isActive: true
  },
  {
    courseCode: 'MATH150',
    courseName: 'Introduction to Statistics',
    description: 'Descriptive statistics, probability distributions, hypothesis testing, and data analysis',
    credits: 3,
    department: 'Mathematics',
    level: '100',
    instructor: 'Dr. Nancy Phillips',
    maxCapacity: 40,
    currentEnrollment: 32,
    schedule: 'TTh 09:00-11:00',
    room: 'Math Building 110',
    semester: 'Summer',
    year: 2026,
    prerequisites: null,
    isActive: true
  }
];
    
    for (const courseData of sampleCourses) {
      const [course, created] = await Course.findOrCreate({
        where: { courseCode: courseData.courseCode },
        defaults: courseData
      });
      
      if (created) {
        console.log(`✅ Created: ${courseData.courseCode} - ${courseData.courseName}`);
      } else {
        console.log(`⏭️  Skipped: ${courseData.courseCode} (already exists)`);
      }
    }
    
    console.log(`\n✅ Successfully seeded ${sampleCourses.length} courses!`);
    console.log('\n📝 Login Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@aucegypt.edu');
    console.log('  Password: password123');
    console.log('\nStudent:');
    console.log('  Email: student@aucegypt.edu');
    console.log('  Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
};

seedCourses();
