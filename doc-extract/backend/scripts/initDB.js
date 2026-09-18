const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Vendor = require('../src/models/Vendor');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: '../.env' });

const initDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data (in development only)
    if (process.env.NODE_ENV === 'development') {
      await Promise.all([
        User.deleteMany({}),
        Vendor.deleteMany({})
      ]);
      console.log('Cleared existing data');
    }

    // Create sample admin user
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const adminUser = await User.create({
      email: 'admin@invoiceextractor.com',
      password_hash: adminPassword,
      full_name: 'System Administrator',
      role: 'admin'
    });

    console.log('Created admin user:', adminUser.email);

    // Create sample accountant user
    const accountantPassword = await bcrypt.hash('Accountant@123', 12);
    const accountantUser = await User.create({
      email: 'accountant@invoiceextractor.com',
      password_hash: accountantPassword,
      full_name: 'Sample Accountant',
      role: 'accountant'
    });

    console.log('Created accountant user:', accountantUser.email);

    // Create sample vendors
    const vendors = await Vendor.insertMany([
      {
        name: 'ABC Office Supplies Ltd.',
        contact_person: 'Rajesh Kumar',
        email: 'rajesh@abcofficesupplies.com',
        phone: '+91-11-2345-6789',
        address: '123, Nehru Place, New Delhi - 110019',
        tax_id: '07AABCU1234R1Z5'
      },
      {
        name: 'XYZ Telecom Solutions',
        contact_person: 'Priya Sharma',
        email: 'priya@xyztelecom.com',
        phone: '+91-22-3456-7890',
        address: '456, Bandra Kurla Complex, Mumbai - 400051',
        tax_id: '27AAACX5678L2Z3'
      },
      {
        name: 'Global Logistics Corp.',
        contact_person: 'Amit Patel',
        email: 'amit@globallogistics.com',
        phone: '+91-80-4567-8901',
        address: '789, Electronic City, Bangalore - 560100',
        tax_id: '29AABCG9012T1Z7'
      }
    ]);

    console.log(`Created ${vendors.length} sample vendors`);

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

initDB();