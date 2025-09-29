import { Company } from '../models/company.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import { Application } from '../models/application.model.js';

export const getEmployerDashboard = async (req, res) => {
  try {
    // Get employer's company
    const company = await Company.findOne({ creator: req.user._id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get all vacancies for the company
    const vacancies = await Vacancy.find({ company: company._id });
    
    // Calculate statistics
    const stats = {
      totalVacancies: vacancies.length,
      activeVacancies: vacancies.filter(v => !v.isArchived).length,
      totalApplications: 0,
      applicationsByStatus: {
        pending: 0,
        reviewed: 0,
        accepted: 0,
        rejected: 0
      },
      recentApplications: [],
      vacancyStats: [],
      monthlyApplications: Array(12).fill(0) // For monthly chart
    };

    // Get all applications for company's vacancies
    const applications = await Application.find({
      job: { $in: vacancies.map(v => v._id) }
    }).populate('user', 'firstName lastName email').populate('resume');

    // Process applications
    applications.forEach(app => {
      // Update status counts
      stats.applicationsByStatus[app.status]++;
      stats.totalApplications++;

      // Update monthly stats
      const month = new Date(app.appliedAt).getMonth();
      stats.monthlyApplications[month]++;
    });

    // Get recent applications
    stats.recentApplications = applications
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      .slice(0, 5)
      .map(app => ({
        candidate: {
          name: `${app.user.firstName} ${app.user.lastName}`,
          email: app.user.email
        },
        status: app.status,
        appliedAt: app.appliedAt
      }));

    // Calculate per-vacancy stats
    stats.vacancyStats = await Promise.all(vacancies.map(async vacancy => {
      const vacancyApplications = applications.filter(app => 
        app.job.equals(vacancy._id)
      );

      return {
        id: vacancy._id,
        title: vacancy.title,
        totalApplications: vacancyApplications.length,
        status: vacancy.isArchived ? 'Archived' : 'Active',
        applicationsByStatus: {
          pending: vacancyApplications.filter(a => a.status === 'pending').length,
          reviewed: vacancyApplications.filter(a => a.status === 'reviewed').length,
          accepted: vacancyApplications.filter(a => a.status === 'accepted').length,
          rejected: vacancyApplications.filter(a => a.status === 'rejected').length
        }
      };
    }));

    res.json({
      company: {
        id: company._id,
        name: company.name,
        logo: company.logo,
        status: company.status
      },
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};