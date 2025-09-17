/**
 * Test script to verify KPI implementation is working correctly
 */

const mongoose = require('mongoose');
const KPI = require('./models/KPI');
const User = require('./models/User');
const KPIStatus = require('./models/KPIStatus');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

const testKPIImplementation = async () => {
  try {
    console.log('🧪 Testing KPI Implementation...\n');

    // Test 1: Check if KPI model has new fields
    console.log('1️⃣ Testing KPI Model Structure...');
    const kpiSchema = KPI.schema;
    const requiredFields = ['targets', 'stats', 'category', 'priority', 'status'];
    
    for (const field of requiredFields) {
      if (kpiSchema.paths[field]) {
        console.log(`   ✅ ${field} field exists`);
      } else {
        console.log(`   ❌ ${field} field missing`);
      }
    }

    // Test 2: Check if constants are exported
    console.log('\n2️⃣ Testing Constants Export...');
    const constants = ['ROLES', 'BATTALIONS', 'CATEGORIES', 'PRIORITIES', 'STATUSES'];
    
    for (const constant of constants) {
      if (KPI[constant]) {
        console.log(`   ✅ ${constant} exported:`, KPI[constant]);
      } else {
        console.log(`   ❌ ${constant} not exported`);
      }
    }

    // Test 3: Test KPI creation with new schema
    console.log('\n3️⃣ Testing KPI Creation...');
    const testKPI = new KPI({
      title: 'Test KPI',
      description: 'Test description',
      category: 'spiritual',
      priority: 'high',
      createdBy: new mongoose.Types.ObjectId(),
      targets: {
        allUsers: true,
        roles: ['commando'],
        battalions: ['Alpha'],
        specificUsers: []
      }
    });

    // Validate the KPI
    try {
      await testKPI.validate();
      console.log('   ✅ KPI validation passed');
    } catch (error) {
      console.log('   ❌ KPI validation failed:', error.message);
    }

    // Test 4: Test instance methods
    console.log('\n4️⃣ Testing Instance Methods...');
    
    // Test getTargetDescription
    if (typeof testKPI.getTargetDescription === 'function') {
      const description = testKPI.getTargetDescription();
      console.log('   ✅ getTargetDescription works:', description);
    } else {
      console.log('   ❌ getTargetDescription method missing');
    }

    // Test 5: Test static methods
    console.log('\n5️⃣ Testing Static Methods...');
    const staticMethods = ['findActive', 'findByTarget', 'getOverdueKPIs', 'findRecentlyUpdated'];
    
    for (const method of staticMethods) {
      if (typeof KPI[method] === 'function') {
        console.log(`   ✅ ${method} method exists`);
      } else {
        console.log(`   ❌ ${method} method missing`);
      }
    }

    // Test 6: Test virtual fields
    console.log('\n6️⃣ Testing Virtual Fields...');
    const virtuals = ['formattedDeadline', 'daysUntilDeadline', 'targetSummary'];
    
    for (const virtual of virtuals) {
      if (testKPI[virtual] !== undefined) {
        console.log(`   ✅ ${virtual} virtual field works:`, testKPI[virtual]);
      } else {
        console.log(`   ❌ ${virtual} virtual field missing`);
      }
    }

    console.log('\n🎉 KPI Implementation Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run test if this script is executed directly
if (require.main === module) {
  connectDB().then(() => {
    testKPIImplementation();
  });
}

module.exports = { testKPIImplementation };
