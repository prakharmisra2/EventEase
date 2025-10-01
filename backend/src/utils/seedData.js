const { User } = require('../models');

const seedUsers = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ 
      where: { email: 'admin@gmail.com' } 
    });

    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@gmail.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Check if test user exists
    const userExists = await User.findOne({ 
      where: { email: 'user@gmail.com' } 
    });

    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@gmail.com',
        password: 'user123',
        role: 'user'
      });
      console.log('✅ Test user created: user@gmail.com / user123');
    } else {
      console.log('ℹ️  Test user already exists');
    }

  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  }
};

module.exports = { seedUsers };