/**
 * KPI Schema Migration Script
 * 
 * This script migrates existing KPIs from the old schema to the new enhanced schema.
 * It converts legacy fields to the new targets structure and ensures data integrity.
 */

const mongoose = require('mongoose');
const KPI = require('../models/KPI');
const User = require('../models/User');
const KPIStatus = require('../models/KPIStatus');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

/**
 * Migrate a single KPI from old schema to new schema
 */
const migrateKPI = async (kpi) => {
  try {
    const updateData = {};

    // Convert legacy assignedTo to new targets structure
    if (kpi.assignedTo) {
      switch (kpi.assignedTo) {
        case 'all':
          updateData['targets.allUsers'] = true;
          break;
        case 'commander':
        case 'commando':
        case 'specialForce':
        case 'globalSoldier':
          updateData['targets.roles'] = [kpi.assignedTo];
          break;
        case 'specific':
          if (kpi.specificUsers && kpi.specificUsers.length > 0) {
            updateData['targets.specificUsers'] = kpi.specificUsers;
          }
          break;
      }
    }

    // Convert legacy battalion to new targets structure
    if (kpi.battalion) {
      updateData['targets.battalions'] = [kpi.battalion];
    }

    // Set default values for new fields
    updateData.category = 'other';
    updateData.priority = 'medium';
    updateData.status = 'active';
    updateData.isPublic = true;
    updateData.isDeleted = false;

    // Update the KPI
    await KPI.findByIdAndUpdate(kpi._id, updateData);

    // Update stats for this KPI
    const kpiDoc = await KPI.findById(kpi._id);
    await kpiDoc.updateStats();

    console.log(`✅ Migrated KPI: ${kpi.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to migrate KPI ${kpi._id}:`, error.message);
    return false;
  }
};

/**
 * Main migration function
 */
const migrateKPIs = async () => {
  try {
    console.log('🚀 Starting KPI schema migration...');

    // Find all KPIs that need migration (have legacy fields)
    const kpisToMigrate = await KPI.find({
      $or: [
        { assignedTo: { $exists: true } },
        { battalion: { $exists: true } },
        { 'targets.allUsers': { $exists: false } }
      ]
    });

    console.log(`📊 Found ${kpisToMigrate.length} KPIs to migrate`);

    let successCount = 0;
    let errorCount = 0;

    // Migrate each KPI
    for (const kpi of kpisToMigrate) {
      const success = await migrateKPI(kpi);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} KPIs`);
    console.log(`❌ Failed to migrate: ${errorCount} KPIs`);

    // Verify migration by checking stats
    console.log('\n🔍 Verifying migration...');
    const activeKPIs = await KPI.find({ status: 'active', isDeleted: false });
    console.log(`📊 Active KPIs: ${activeKPIs.length}`);

    // Check for KPIs with proper targets
    const kpisWithTargets = await KPI.find({
      status: 'active',
      isDeleted: false,
      $or: [
        { 'targets.allUsers': true },
        { 'targets.roles': { $exists: true, $not: { $size: 0 } } },
        { 'targets.battalions': { $exists: true, $not: { $size: 0 } } },
        { 'targets.specificUsers': { $exists: true, $not: { $size: 0 } } }
      ]
    });
    console.log(`🎯 KPIs with proper targets: ${kpisWithTargets.length}`);

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  connectDB().then(() => {
    migrateKPIs();
  });
}

module.exports = { migrateKPIs, migrateKPI };
