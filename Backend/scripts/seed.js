// backend/scripts/seed.js  ->  run with: npm run seed
// Creates the admin account, a demo student and sample courses (safe to run many times).
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const { default: User } = await import('../models/User.js');
const { default: Course } = await import('../models/Course.js');
const { courseContent } = await import('./courseContent.js');

const adminEmail = (process.env.ADMIN_EMAIL || 'admin@acadexa.com').toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || 'admin12345';

try {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('Connected to MongoDB');

  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      name: 'ACADEXA Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'admin',
      department: 'Administration',
    });
    console.log(`✔ Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`• Admin already exists: ${adminEmail}`);
  }

  const demoEmail = 'student@acadexa.com';
  if (!(await User.findOne({ email: demoEmail }))) {
    await User.create({
      name: 'Demo Student',
      email: demoEmail,
      passwordHash: await bcrypt.hash('student123', 12),
      role: 'student',
      department: 'Computer Science',
      studentId: 'STU-2026-001',
      phone: '9876543210',
    });
    console.log(`✔ Demo student created: ${demoEmail} / student123`);
  } else {
    console.log(`• Demo student already exists: ${demoEmail}`);
  }

  if ((await Course.countDocuments()) === 0) {
    await Course.insertMany([
      { title: 'Frontend Web Development', duration: '8 Weeks', instructor: 'Dr. Priya Raman', description: 'Build modern responsive sites with HTML, CSS, JavaScript and React.' },
      { title: 'Data Science Fundamentals', duration: '10 Weeks', instructor: 'Prof. Arun Kumar', description: 'Data analysis, visualization and machine learning basics with Python.' },
      { title: 'Artificial Intelligence', duration: '12 Weeks', instructor: 'Dr. Meena Iyer', description: 'Explore neural networks and intelligent systems.' },
      { title: 'Python Programming', duration: '6 Weeks', instructor: 'Mr. Karthik S', description: 'Core Python language fundamentals and problem solving.' },
      { title: 'Backend with Node.js & Express', duration: '8 Weeks', instructor: 'Ms. Divya N', description: 'REST APIs, JWT authentication and MongoDB integration.' },
    ]);
    console.log('✔ Sample courses created');
  } else {
    console.log('• Courses already exist, skipping');
  }

  // Add lessons + quiz to courses that have none yet (never overwrites content you wrote yourself)
  const missing = [];
  for (const course of await Course.find()) {
    if (course.modules.length > 0 || course.quiz.length > 0) continue;
    const content = courseContent[course.title];
    if (!content) {
      missing.push(course.title);
      continue;
    }
    course.modules = content.modules;
    course.quiz = content.quiz;
    await course.save();
    console.log(`✔ Learning content added: ${course.title}`);
  }
  if (missing.length) {
    console.log(`• No sample content for: ${missing.join(', ')} (add it in Admin -> Manage Courses)`);
  }
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
