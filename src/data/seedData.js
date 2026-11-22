// AI-generated realistic demo data. Passwords are for demo accounts only.
export const users = [
  { name: "MentorLagbe Admin", email: "admin@mentorlagbe.com", password: "Admin@123", role: "admin", phone: "01700000001", bio: "Platform administrator." },
  { name: "Nusrat Jahan", email: "tutor@mentorlagbe.com", password: "Tutor@123", role: "tutor", plan: "pro", phone: "01711111101", bio: "BUET graduate with 6 years of experience teaching SSC and A Level Mathematics." },
  { name: "Imran Hossain", email: "imran@mentorlagbe.com", password: "Tutor@123", role: "tutor", plan: "pro", phone: "01711111102", bio: "Physics and Chemistry mentor. I turn confusing concepts into simple pictures." },
  { name: "Farhana Rahman", email: "farhana@mentorlagbe.com", password: "Tutor@123", role: "tutor", phone: "01711111103", bio: "IELTS trainer (Band 8.5) and English language coach." },
  { name: "Tanvir Alam", email: "tanvir@mentorlagbe.com", password: "Tutor@123", role: "tutor", phone: "01711111104", bio: "Software engineer who teaches Python, JavaScript and ICT." },
  { name: "Sadia Karim", email: "sadia@mentorlagbe.com", password: "Tutor@123", role: "tutor", phone: "01711111105", bio: "Biology, Accounting and Bangla tutor with a patient, exam-focused style." },
  { name: "Rafi Chowdhury", email: "student@mentorlagbe.com", password: "Student@123", role: "student", phone: "01811111101", bio: "HSC candidate preparing for medical admission." },
  { name: "Mim Akter", email: "mim@mentorlagbe.com", password: "Student@123", role: "student", plan: "pro", phone: "01811111102", bio: "Aiming for IELTS Band 7.5." },
  { name: "Arif Hasan", email: "arif@mentorlagbe.com", password: "Student@123", role: "student", phone: "01811111103", bio: "University student learning to code." },
  { name: "Tisha Roy", email: "tisha@mentorlagbe.com", password: "Student@123", role: "student", phone: "01811111104", bio: "Class 8 student improving English." },
];

// tutor = the tutor's email. status: approved | pending | rejected
export const tuitions = [
  { tutor: "tutor@mentorlagbe.com", title: "SSC Mathematics Crash Batch", subject: "Mathematics", classLevel: "SSC", mode: "Offline", location: "Dhanmondi, Dhaka", monthlyFee: 3500, daysPerWeek: 4, description: "A structured batch covering algebra, geometry and trigonometry with weekly model tests. Small group of 8 students so every doubt gets answered." },
  { tutor: "imran@mentorlagbe.com", title: "HSC Physics Concept Builder", subject: "Physics", classLevel: "HSC", mode: "Online", location: "Online via Google Meet", monthlyFee: 3000, daysPerWeek: 3, description: "Concept-first Physics classes with animations, numerical practice and recorded sessions for revision. Ideal for admission-test candidates." },
  { tutor: "farhana@mentorlagbe.com", title: "IELTS Band 7+ Intensive", subject: "IELTS", classLevel: "Professional", mode: "Online", location: "Online via Zoom", monthlyFee: 5500, daysPerWeek: 5, description: "Daily practice for all four modules with personal speaking feedback and weekly full mock tests graded by a certified trainer." },
  { tutor: "tanvir@mentorlagbe.com", title: "Python for Beginners", subject: "Programming", classLevel: "University", mode: "Online", location: "Online via Google Meet", monthlyFee: 4500, daysPerWeek: 3, description: "Start from zero and build small real projects: a calculator, a to-do app and a data analyser. No prior experience needed." },
  { tutor: "farhana@mentorlagbe.com", title: "Class 8 English Grammar & Writing", subject: "English", classLevel: "Class 6-8", mode: "Offline", location: "Uttara, Dhaka", monthlyFee: 2500, daysPerWeek: 3, description: "Friendly grammar lessons, paragraph writing and reading practice to build confidence in school exams." },
  { tutor: "imran@mentorlagbe.com", title: "HSC Chemistry: Organic Made Easy", subject: "Chemistry", classLevel: "HSC", mode: "Offline", location: "Mirpur, Dhaka", monthlyFee: 3200, daysPerWeek: 4, description: "Reaction mechanisms explained step by step, with memory tricks and past-paper practice every week." },
  { tutor: "tutor@mentorlagbe.com", title: "A Level Mathematics 1-on-1 Mentorship", subject: "Mathematics", classLevel: "A Level", mode: "Online", location: "Online via Zoom", monthlyFee: 6000, daysPerWeek: 2, description: "Personal mentorship for Pure Maths and Statistics, tailored to your exam board and your weak areas." },
  { tutor: "tanvir@mentorlagbe.com", title: "Web Development with JavaScript", subject: "Programming", classLevel: "University", mode: "Online", location: "Online via Google Meet", monthlyFee: 5000, daysPerWeek: 3, description: "HTML, CSS and modern JavaScript, finishing with a portfolio website you can show to employers." },
  { tutor: "sadia@mentorlagbe.com", title: "HSC Biology: Zoology & Botany", subject: "Biology", classLevel: "HSC", mode: "Offline", location: "Banani, Dhaka", monthlyFee: 3000, daysPerWeek: 4, description: "Diagram-driven Biology classes with chapter tests, built for medical admission preparation." },
  { tutor: "sadia@mentorlagbe.com", title: "Accounting Basics for BBA Students", subject: "Accounting", classLevel: "University", mode: "Offline", location: "Gulshan, Dhaka", monthlyFee: 3800, daysPerWeek: 3, description: "Journal entries, ledgers and financial statements taught with real company examples." },
  { tutor: "tanvir@mentorlagbe.com", title: "SSC ICT Practical & Theory", subject: "ICT", classLevel: "SSC", mode: "Online", location: "Online via Google Meet", monthlyFee: 2200, daysPerWeek: 3, description: "Complete SSC ICT syllabus with hands-on practice in HTML and number systems." },
  { tutor: "sadia@mentorlagbe.com", title: "Bangla Literature & Composition", subject: "Bangla", classLevel: "SSC", mode: "Offline", location: "Mohammadpur, Dhaka", monthlyFee: 2000, daysPerWeek: 3, description: "Poetry and prose analysis plus composition writing techniques that earn full marks." },
  { tutor: "imran@mentorlagbe.com", title: "O Level Physics Online Batch", subject: "Physics", classLevel: "O Level", mode: "Online", location: "Online via Zoom", monthlyFee: 4000, daysPerWeek: 3, description: "Cambridge syllabus Physics with past-paper walkthroughs.", status: "pending" },
  { tutor: "farhana@mentorlagbe.com", title: "Spoken English Weekend Club", subject: "English", classLevel: "Professional", mode: "Offline", location: "Dhanmondi, Dhaka", monthlyFee: 1800, daysPerWeek: 2, description: "Weekend conversation practice to improve fluency.", status: "pending" },
  { tutor: "tutor@mentorlagbe.com", title: "Advanced Calculus Rapid Revision", subject: "Mathematics", classLevel: "University", mode: "Online", location: "Online via Zoom", monthlyFee: 4200, daysPerWeek: 3, description: "A short revision course for first-year university students.", status: "rejected" },
  { tutor: "farhana@mentorlagbe.com", title: "IELTS Writing Workshop", subject: "IELTS", classLevel: "Professional", mode: "Online", location: "Online via Zoom", monthlyFee: 3000, daysPerWeek: 2, description: "Task 1 and Task 2 writing clinic with detailed feedback.", isActive: false },
];

// tuition = index in the tuitions array above
export const applications = [
  { tuition: 0, student: "student@mentorlagbe.com", status: "accepted", phone: "01811111101", schedule: "Sat, Mon, Wed evenings", note: "I need extra help with trigonometry before the board exam." },
  { tuition: 1, student: "student@mentorlagbe.com", status: "pending", phone: "01811111101", schedule: "Weekday evenings", note: "Preparing for medical admission, want strong numerical practice." },
  { tuition: 2, student: "mim@mentorlagbe.com", status: "accepted", phone: "01811111102", schedule: "Mornings before 10am", note: "Target Band 7.5 in three months." },
  { tuition: 3, student: "arif@mentorlagbe.com", status: "pending", phone: "01811111103", schedule: "Weekends", note: "Complete beginner, excited to learn." },
  { tuition: 4, student: "tisha@mentorlagbe.com", status: "rejected", phone: "01811111104", schedule: "Friday and Saturday", note: "My parents want me to improve spoken English." },
  { tuition: 6, student: "mim@mentorlagbe.com", status: "pending", phone: "01811111102", schedule: "Late evenings", note: "Interested in statistics mentoring." },
  { tuition: 7, student: "arif@mentorlagbe.com", status: "accepted", phone: "01811111103", schedule: "Sun, Tue, Thu nights", note: "Want to build a portfolio and apply for internships." },
];

export const payments = [
  { email: "imran@mentorlagbe.com", planName: "Pro Tutor Plan", amount: 15, transactionId: "pi_seed_001", stripeSessionId: "cs_seed_001" },
  { email: "mim@mentorlagbe.com", planName: "Pro Student Plan", amount: 10, transactionId: "pi_seed_002", stripeSessionId: "cs_seed_002" },
  { email: "tutor@mentorlagbe.com", planName: "Pro Tutor Plan", amount: 15, transactionId: "pi_seed_003", stripeSessionId: "cs_seed_003" },
];