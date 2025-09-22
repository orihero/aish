import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index.js';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Company } from '../models/company.model.js';
import { Vacancy } from '../models/vacancy.model.js';

const categories = [
  {
    title: [{ language: 'en', value: 'Software Development' }],
    icon: 'Code',
    subcategories: [
      { title: [{ language: 'en', value: 'Frontend Development' }], icon: 'Layout' },
      { title: [{ language: 'en', value: 'Backend Development' }], icon: 'Database' },
      { title: [{ language: 'en', value: 'Mobile Development' }], icon: 'Smartphone' },
      { title: [{ language: 'en', value: 'DevOps' }], icon: 'Settings' }
    ]
  },
  {
    title: [{ language: 'en', value: 'Design' }],
    icon: 'Palette',
    subcategories: [
      { title: [{ language: 'en', value: 'UI/UX Design' }], icon: 'Figma' },
      { title: [{ language: 'en', value: 'Graphic Design' }], icon: 'Image' },
      { title: [{ language: 'en', value: 'Motion Design' }], icon: 'Video' }
    ]
  },
  // Add more categories as needed...
];

describe('Category API Tests', () => {
  let adminToken;
  let regularToken;
  let employerToken;
  let testCompany;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI.replace('vuexy', 'vuexy_test'));

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@test.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    // Create regular user
    const regularUser = await User.create({
      email: 'user@test.com',
      password: 'user123',
      firstName: 'Regular',
      lastName: 'User',
      role: 'employee'
    });

    // Create employer user
    const employerUser = await User.create({
      email: 'employer@test.com',
      password: 'employer123',
      firstName: 'Employer',
      lastName: 'User',
      role: 'employer'
    });

    // Create a test company
    testCompany = await Company.create({
      name: 'Test Company',
      description: 'A test company',
      industry: 'Technology',
      size: '51-200',
      location: {
        country: 'United States',
        city: 'San Francisco'
      },
      contact: {
        email: 'contact@testcompany.com'
      },
      creator: employerUser._id
    });

    // Get tokens
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });
    adminToken = adminResponse.body.token;

    const regularResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'user123' });
    regularToken = regularResponse.body.token;

    const employerResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'employer@test.com', password: 'employer123' });
    employerToken = employerResponse.body.token;
  });

  afterAll(async () => {
    // Clean up database
    await User.deleteMany({});
    await Category.deleteMany({});
    await Company.deleteMany({});
    await Vacancy.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear categories before each test
    await Category.deleteMany({});
  });

  describe('POST /api/categories', () => {
    it('should create categories successfully as admin', async () => {
      for (const category of categories) {
        const response = await request(app)
          .post('/api/categories')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(category);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('title');
        expect(response.body.title[0].value).toBe(category.title[0].value);
        expect(response.body).toHaveProperty('icon', category.icon);
        expect(response.body).toHaveProperty('subcategories');
        expect(response.body.subcategories).toHaveLength(category.subcategories.length);
      }

      // Verify all categories were created
      const allCategories = await Category.find();
      expect(allCategories).toHaveLength(categories.length);
    });

    it('should not allow regular users to create categories', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${regularToken}`)
        .send(categories[0]);

      expect(response.status).toBe(403);
    });

    it('should validate required fields', async () => {
      const invalidCategory = {
        // Missing title
        icon: 'Code'
      };

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidCategory);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      // Seed some categories
      await Category.create(categories);
    });

    it('should retrieve all categories', async () => {
      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(categories.length);
    });

    it('should include all required fields in response', async () => {
      const response = await request(app)
        .get('/api/categories');

      const category = response.body[0];
      expect(category).toHaveProperty('title');
      expect(category).toHaveProperty('icon');
      expect(category).toHaveProperty('subcategories');
    });
  });

  describe('PUT /api/categories/:id', () => {
    let categoryId;

    beforeEach(async () => {
      // Create a test category
      const category = await Category.create(categories[0]);
      categoryId = category._id;
    });

    it('should update category successfully as admin', async () => {
      const update = {
        title: [{ language: 'en', value: 'Updated Software Development' }],
        icon: 'CodeNew'
      };

      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(update);

      expect(response.status).toBe(200);
      expect(response.body.title[0].value).toBe(update.title[0].value);
      expect(response.body.icon).toBe(update.icon);
    });

    it('should not allow regular users to update categories', async () => {
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({ title: [{ language: 'en', value: 'Try Update' }] });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    let categoryId;

    beforeEach(async () => {
      // Create a test category
      const category = await Category.create(categories[0]);
      categoryId = category._id;
    });

    it('should delete category successfully as admin', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      // Verify category was deleted
      const deletedCategory = await Category.findById(categoryId);
      expect(deletedCategory).toBeNull();
    });

    it('should not allow regular users to delete categories', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Create Vacancies for Subcategories', () => {
    let createdCategories;

    beforeEach(async () => {
      // Create categories first
      createdCategories = await Category.create(categories);
    });

    it('should create multiple vacancies for each subcategory', async () => {
      const workTypes = ['remote', 'hybrid', 'on-site'];
      const employmentTypes = ['full-time', 'part-time', 'contract'];

      for (const category of createdCategories) {
        for (const subcategory of category.subcategories) {
          // Create 5-7 vacancies for each subcategory
          const numVacancies = Math.floor(Math.random() * 3) + 5; // Random number between 5-7

          for (let i = 0; i < numVacancies; i++) {
            const vacancyData = {
              title: `${subcategory.title[0].value} Specialist - Level ${i + 1}`,
              category: category._id,
              subcategory: subcategory._id,
              company: testCompany._id,
              description: `We are looking for a ${subcategory.title[0].value} specialist with ${i + 2} years of experience...`,
              salary: {
                min: 50000 + (i * 10000),
                max: 80000 + (i * 15000),
                currency: 'USD'
              },
              employmentType: employmentTypes[i % employmentTypes.length],
              workType: workTypes[i % workTypes.length]
            };

            const response = await request(app)
              .post('/api/vacancies')
              .set('Authorization', `Bearer ${employerToken}`)
              .send(vacancyData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('title', vacancyData.title);
            expect(response.body).toHaveProperty('category', vacancyData.category.toString());
            expect(response.body).toHaveProperty('subcategory', vacancyData.subcategory.toString());
          }

          // Verify vacancies were created for this subcategory
          const vacancies = await Vacancy.find({
            category: category._id,
            subcategory: subcategory._id
          });
          expect(vacancies).toHaveLength(numVacancies);
        }
      }

      // Verify total number of vacancies
      const totalVacancies = await Vacancy.countDocuments();
      expect(totalVacancies).toBeGreaterThan(0);

      // Log summary
      const summary = await Vacancy.aggregate([
        {
          $group: {
            _id: { category: '$category', subcategory: '$subcategory' },
            count: { $sum: 1 }
          }
        }
      ]);

      console.log('Vacancy creation summary:');
      for (const group of summary) {
        const category = await Category.findById(group._id.category);
        const subcategory = category.subcategories.id(group._id.subcategory);
        console.log(`${category.title[0].value} - ${subcategory.title[0].value}: ${group.count} vacancies`);
      }
    });
  });
});