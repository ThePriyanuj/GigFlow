import bcrypt from 'bcryptjs';
import { UserModel } from './models/UserModel';
import { LeadModel } from './models/LeadModel';
import { UserRole } from '../../shared/types/auth.types';
import { LeadStatus, LeadSource } from '../../shared/types/lead.types';

export const seedIfEmpty = async (): Promise<void> => {
  const userCount = await UserModel.countDocuments();
  const leadCount = await LeadModel.countDocuments();

  if (userCount > 0 && leadCount > 0) return;

  console.log('📦 Checking database seed state...');

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  const salesPassword = await bcrypt.hash('sales123', salt);

  let admin = await UserModel.findOne({ email: 'admin@gigflow.com' });
  if (!admin) {
    admin = await UserModel.create({
      name: 'Admin User',
      email: 'admin@gigflow.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
  }

  let salesUser = await UserModel.findOne({ email: 'sarah@gigflow.com' });
  if (!salesUser) {
    salesUser = await UserModel.create({
      name: 'Sarah Sales',
      email: 'sarah@gigflow.com',
      password: salesPassword,
      role: UserRole.SALES,
    });
  }

  if (leadCount > 0) {
    console.log('✅ Users are available and leads already exist, skipping lead seed.\n');
    return;
  }

  const leads = [
    { name: 'Acme Corp', email: 'contact@acme.com', phone: '+1-555-0101', company: 'Acme Corporation', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, value: 25000, notes: 'Enterprise client interested in annual plan', createdBy: admin._id },
    { name: 'TechStart Inc', email: 'hello@techstart.io', phone: '+1-555-0102', company: 'TechStart Inc', status: LeadStatus.NEW, source: LeadSource.REFERRAL, value: 8000, notes: 'Found through referral outreach', createdBy: salesUser._id },
    { name: 'Global Media Ltd', email: 'info@globalmedia.com', phone: '+1-555-0103', company: 'Global Media', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, value: 45000, notes: 'Referred by existing client', createdBy: admin._id },
    { name: 'DataFlow Systems', email: 'sales@dataflow.dev', phone: '+1-555-0104', company: 'DataFlow Systems', status: LeadStatus.CONTACTED, source: LeadSource.WEBSITE, value: 32000, notes: 'Sent proposal, awaiting response', createdBy: salesUser._id },
    { name: 'CloudNine Solutions', email: 'team@cloudnine.io', phone: '+1-555-0105', company: 'CloudNine Solutions', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, value: 18500, notes: 'Signed 12-month contract', createdBy: admin._id },
    { name: 'BrightPath Labs', email: 'biz@brightpath.co', phone: '+1-555-0106', company: 'BrightPath Labs', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM, value: 12000, notes: 'Came through Instagram campaign', createdBy: salesUser._id },
    { name: 'Nexus Digital', email: 'info@nexusdigital.com', phone: '+1-555-0107', company: 'Nexus Digital Agency', status: LeadStatus.LOST, source: LeadSource.REFERRAL, value: 55000, notes: 'Went with competitor pricing', createdBy: admin._id },
    { name: 'Velocity Partners', email: 'hello@velocity.partners', phone: '+1-555-0108', company: 'Velocity Partners', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL, value: 28000, notes: 'Scheduled demo for next week', createdBy: salesUser._id },
    { name: 'Summit Enterprises', email: 'contact@summit-ent.com', phone: '+1-555-0109', company: 'Summit Enterprises', status: LeadStatus.CONTACTED, source: LeadSource.WEBSITE, value: 67000, notes: 'Large enterprise, multiple stakeholders', createdBy: admin._id },
    { name: 'Horizon Tech', email: 'dev@horizontech.io', phone: '+1-555-0110', company: 'Horizon Technology', status: LeadStatus.CONTACTED, source: LeadSource.WEBSITE, value: 15000, notes: 'Interested in starter package', createdBy: salesUser._id },
    { name: 'Atlas Consulting', email: 'ops@atlasconsult.com', phone: '+1-555-0111', company: 'Atlas Consulting Group', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, value: 42000, notes: 'Won through networking event', createdBy: admin._id },
    { name: 'Pinnacle Software', email: 'sales@pinnacle.dev', phone: '+1-555-0112', company: 'Pinnacle Software Inc', status: LeadStatus.NEW, source: LeadSource.INSTAGRAM, value: 9500, notes: 'Trial user converted', createdBy: salesUser._id },
    { name: 'Forge Industries', email: 'contact@forge-ind.com', phone: '+1-555-0113', company: 'Forge Industries LLC', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL, value: 38000, notes: 'B2B referral from partner network', createdBy: admin._id },
    { name: 'Prism Analytics', email: 'team@prismanalytics.co', phone: '+1-555-0114', company: 'Prism Analytics', status: LeadStatus.CONTACTED, source: LeadSource.REFERRAL, value: 21000, notes: 'Follow-up scheduled', createdBy: salesUser._id },
    { name: 'Evergreen Solutions', email: 'hello@evergreen.io', phone: '+1-555-0115', company: 'Evergreen Solutions', status: LeadStatus.NEW, source: LeadSource.WEBSITE, value: 16000, notes: 'Inbound lead from blog', createdBy: admin._id },
  ];

  await LeadModel.insertMany(leads);

  console.log('✅ Database seeded:');
  console.log('   Admin: admin@gigflow.com / admin123');
  console.log('   Sales: sarah@gigflow.com / sales123');
  console.log(`   Leads: ${leads.length} sample leads\n`);
};
