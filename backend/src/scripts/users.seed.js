import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear users collection
    await User.deleteMany({});
    console.log('Cleared users collection');

    // Create test users
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    const employerUsers = await Promise.all([
      User.create({
        email: 'employer1@example.com',
        password: 'employer123',
        firstName: 'John',
        lastName: 'Employer',
        role: 'employer'
      }),
      User.create({
        email: 'employer2@example.com',
        password: 'employer123',
        firstName: 'Jane',
        lastName: 'Employer',
        role: 'employer'
      })
    ]);

    const jobSeekerUsers = await Promise.all([
      User.create({
        email: 'jobseeker1@example.com',
        password: 'jobseeker123',
        firstName: 'Alice',
        lastName: 'JobSeeker',
        role: 'jobseeker'
      }),
      User.create({
        email: 'jobseeker2@example.com',
        password: 'jobseeker123',
        firstName: 'Bob',
        lastName: 'JobSeeker',
        role: 'jobseeker'
      }),
      User.create({
        email: 'jobseeker3@example.com',
        password: 'jobseeker123',
        firstName: 'Charlie',
        lastName: 'JobSeeker',
        role: 'jobseeker'
      })
    ]);

    console.log('Created test users:');
    console.log(`- Admin: ${adminUser.email}`);
    console.log(`- Employers: ${employerUsers.length} users`);
    console.log(`- Job Seekers: ${jobSeekerUsers.length} users`);

    console.log('Users seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Users seed failed:', error);
    process.exit(1);
  }
}

seedUsers();
