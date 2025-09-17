#!/usr/bin/env node

/**
 * KPI Seeding Script
 * 
 * This script runs the KPI seeding functionality from the main seed file.
 * It can be run independently to seed only KPIs without affecting users.
 * 
 * Usage: node runKpiSeed.js
 */

const mongoose = require('mongoose');
const KPI = require('./models/KPI');
const KPIStatus = require('./models/KPIStatus');
const User = require('./models/User');
const KPIStatsService = require('./services/kpiStatsService');
require('dotenv').config();

// Helper function to create KPI with new schema structure
const createKPI = (title, description, category, priority, assignmentType, deadline, battalion = null) => {
  const targets = {
    allUsers: assignmentType === "all",
    roles: assignmentType === "role" ? [assignmentType] : [],
    battalions: battalion ? [battalion] : [],
    specificUsers: assignmentType === "specific" ? [] : []
  };

  return {
    title,
    description,
    category,
    priority,
    deadline,
    targets,
    status: "active",
    isPublic: true,
    // Legacy fields for backward compatibility
    assignedTo: assignmentType,
    battalion: battalion
  };
};

// 50 KPIs distributed across battalions and roles
const kpiData = [
  // ALPHA BATTALION KPIs (13 KPIs)
  createKPI(
    "Alpha Battalion Prayer Meeting Attendance",
    "Achieve 90% attendance rate for weekly battalion prayer meetings",
    "spiritual", "high", "all", new Date('2026-12-31'), "Alpha"
  ),
  createKPI(
    "Alpha Commander Strategic Planning",
    "Complete quarterly strategic planning session for Alpha battalion",
    "leadership", "critical", "commander", new Date('2026-03-31'), "Alpha"
  ),
  createKPI(
    "Alpha Commando Training Completion",
    "Complete advanced spiritual warfare training program",
    "spiritual", "high", "commando", new Date('2026-06-30'), "Alpha"
  ),
  createKPI(
    "Alpha Special Force Outreach",
    "Lead 5 community outreach programs in Q1",
    "ministry", "high", "specialForce", new Date('2026-03-31'), "Alpha"
  ),
  createKPI(
    "Alpha Global Soldier Discipleship",
    "Complete discipleship program and mentor 2 new believers",
    "spiritual", "medium", "globalSoldier", new Date('2026-12-31'), "Alpha"
  ),
  createKPI(
    "Alpha Battalion Financial Stewardship",
    "Achieve 100% tithe compliance among battalion members",
    "spiritual", "high", "all", new Date('2026-12-31'), "Alpha"
  ),
  createKPI(
    "Alpha Commander Leadership Development",
    "Conduct monthly leadership training sessions for battalion officers",
    "leadership", "high", "commander", new Date('2026-12-31'), "Alpha"
  ),
  createKPI(
    "Alpha Commando Mission Readiness",
    "Maintain 95% mission readiness score through regular drills",
    "personal", "critical", "commando", new Date('2026-12-31'), "Alpha"
  ),
  createKPI(
    "Alpha Special Force Intelligence Gathering",
    "Complete monthly intelligence reports on community needs",
    "ministry", "medium", "specialForce", new Date('2026-12-31'), "Alpha"
  ),
  createKPI(
    "Alpha Global Soldier Evangelism",
    "Share the gospel with 10 people monthly",
    "ministry", "high", "globalSoldier", new Date('2026-12-31'), "Alpha"
  ),
  createKPI(
    "Alpha Battalion Unity Building",
    "Organize 4 battalion unity events throughout the year",
    "community", "medium", "all", new Date('2026-12-31'), "Alpha"
  ),
  createKPI(
    "Alpha Commander Resource Management",
    "Optimize battalion resource allocation and utilization",
    "leadership", "medium", "commander", new Date('2026-09-30'), "Alpha"
  ),
  createKPI(
    "Alpha Commando Tactical Excellence",
    "Achieve 100% success rate in assigned tactical operations",
    "personal", "critical", "commando", new Date('2026-12-31'), "Alpha"
  ),

  // BRAVO BATTALION KPIs (13 KPIs)
  createKPI(
    "Bravo Battalion Worship Excellence",
    "Maintain 95% worship service attendance and participation",
    "spiritual", "high", "all", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Commander Vision Casting",
    "Present quarterly vision updates to battalion members",
    "leadership", "high", "commander", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Commando Spiritual Warfare",
    "Complete advanced spiritual warfare certification",
    "spiritual", "critical", "commando", new Date('2026-08-31'), "Bravo"
  ),
  createKPI(
    "Bravo Special Force Community Impact",
    "Implement 3 community development projects",
    "community", "high", "specialForce", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Global Soldier Bible Study",
    "Complete 12-week intensive Bible study program",
    "spiritual", "medium", "globalSoldier", new Date('2026-06-30'), "Bravo"
  ),
  createKPI(
    "Bravo Battalion Fellowship Building",
    "Organize monthly fellowship activities for all members",
    "community", "medium", "all", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Commander Team Building",
    "Conduct quarterly team building retreats",
    "leadership", "medium", "commander", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Commando Mission Planning",
    "Develop and execute 6 strategic mission plans",
    "personal", "high", "commando", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Special Force Innovation",
    "Introduce 2 new ministry initiatives",
    "ministry", "high", "specialForce", new Date('2026-10-31'), "Bravo"
  ),
  createKPI(
    "Bravo Global Soldier Service",
    "Complete 50 hours of community service",
    "community", "medium", "globalSoldier", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Battalion Growth Target",
    "Increase battalion membership by 20%",
    "ministry", "high", "all", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Commander Communication",
    "Maintain weekly communication with all battalion members",
    "leadership", "medium", "commander", new Date('2026-12-31'), "Bravo"
  ),
  createKPI(
    "Bravo Commando Equipment Maintenance",
    "Ensure 100% equipment readiness and maintenance",
    "personal", "high", "commando", new Date('2026-12-31'), "Bravo"
  ),

  // CHARLIE BATTALION KPIs (12 KPIs)
  createKPI(
    "Charlie Battalion Training Excellence",
    "Achieve 100% completion rate for all training programs",
    "personal", "high", "all", new Date('2026-12-31'), "Charlie"
  ),
  createKPI(
    "Charlie Commander Strategic Vision",
    "Develop and implement 5-year strategic plan",
    "leadership", "critical", "commander", new Date('2026-12-31'), "Charlie"
  ),
  createKPI(
    "Charlie Commando Operational Readiness",
    "Maintain 24/7 operational readiness status",
    "personal", "critical", "commando", new Date('2026-12-31'), "Charlie"
  ),
  createKPI(
    "Charlie Special Force Intelligence Analysis",
    "Provide monthly intelligence analysis reports",
    "ministry", "medium", "specialForce", new Date('2026-12-31'), "Charlie"
  ),
  createKPI(
    "Charlie Global Soldier Mentorship",
    "Mentor 3 new believers through discipleship program",
    "spiritual", "high", "globalSoldier", new Date('2026-12-31'), "Charlie"
  ),
  createKPI(
    "Charlie Battalion Innovation Hub",
    "Establish innovation lab for ministry development",
    "ministry", "high", "all", new Date('2026-08-31'), "Charlie"
  ),
  createKPI(
    "Charlie Commander Performance Review",
    "Conduct quarterly performance reviews for all officers",
    "leadership", "medium", "commander", new Date('2026-12-31'), "Charlie"
  ),
  createKPI(
    "Charlie Commando Crisis Response",
    "Develop and test emergency response protocols",
    "personal", "critical", "commando", new Date('2026-07-31'), "Charlie"
  ),
  createKPI(
    "Charlie Special Force Technology Integration",
    "Implement new technology solutions for ministry efficiency",
    "ministry", "medium", "specialForce", new Date('2026-11-30'), "Charlie"
  ),
  createKPI(
    "Charlie Global Soldier Skill Development",
    "Complete 2 skill development courses",
    "personal", "medium", "globalSoldier", new Date('2026-12-31'), "Charlie"
  ),
  createKPI(
    "Charlie Battalion Community Engagement",
    "Establish partnerships with 5 community organizations",
    "community", "high", "all", new Date('2026-12-31'), "Charlie"
  ),
  createKPI(
    "Charlie Commander Resource Optimization",
    "Achieve 15% cost reduction through resource optimization",
    "leadership", "medium", "commander", new Date('2026-12-31'), "Charlie"
  ),

  // DELTA BATTALION KPIs (12 KPIs)
  createKPI(
    "Delta Battalion Excellence Standard",
    "Maintain 98% excellence rating in all activities",
    "personal", "critical", "all", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Commander Legacy Building",
    "Establish lasting legacy programs for future generations",
    "leadership", "high", "commander", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Commando Elite Training",
    "Complete elite commando certification program",
    "personal", "critical", "commando", new Date('2026-09-30'), "Delta"
  ),
  createKPI(
    "Delta Special Force Strategic Intelligence",
    "Develop comprehensive intelligence network",
    "ministry", "high", "specialForce", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Global Soldier Leadership Development",
    "Complete leadership development program",
    "leadership", "high", "globalSoldier", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Battalion Cultural Transformation",
    "Lead cultural transformation initiatives in community",
    "community", "high", "all", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Commander Succession Planning",
    "Develop and implement succession planning strategy",
    "leadership", "high", "commander", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Commando Advanced Tactics",
    "Master advanced tactical procedures and protocols",
    "personal", "critical", "commando", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Special Force Innovation Leadership",
    "Lead innovation initiatives across all battalions",
    "ministry", "critical", "specialForce", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Global Soldier Impact Measurement",
    "Develop and implement impact measurement system",
    "ministry", "medium", "globalSoldier", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Battalion Global Influence",
    "Establish international ministry partnerships",
    "ministry", "high", "all", new Date('2026-12-31'), "Delta"
  ),
  createKPI(
    "Delta Commander Excellence Benchmark",
    "Set new excellence benchmarks for all battalions",
    "leadership", "critical", "commander", new Date('2026-12-31'), "Delta"
  )
];

// Function to seed KPIs
const seedKPIs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing KPIs (optional - remove this if you want to keep existing data)
    await KPI.deleteMany({});
    console.log('Cleared existing KPIs');

    // Get all users to assign as creators
    const users = await User.find({});
    if (users.length === 0) {
      console.log('No users found. Please run user seed first.');
      process.exit(1);
    }

    // Assign creators to KPIs (randomly assign from existing users)
    const kpisWithCreators = kpiData.map(kpi => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      return {
        ...kpi,
        createdBy: randomUser._id
      };
    });

    // Insert KPIs into database
    const createdKPIs = await KPI.insertMany(kpisWithCreators);
    console.log(`Successfully created ${createdKPIs.length} KPIs`);

    // Create KPIStatus entries for each user and KPI combination
    console.log('Creating KPI status entries...');
    const kpiStatusEntries = [];
    
    for (const kpi of createdKPIs) {
      // Determine target users based on targets structure
      let targetUsers = [];
      
      if (kpi.targets.allUsers) {
        targetUsers = users;
      } else {
        if (kpi.targets.roles.length > 0) {
          const roleUsers = users.filter(user => kpi.targets.roles.includes(user.role));
          targetUsers = [...targetUsers, ...roleUsers];
        }
        if (kpi.targets.battalions.length > 0) {
          const battalionUsers = users.filter(user => kpi.targets.battalions.includes(user.battalion));
          targetUsers = [...targetUsers, ...battalionUsers];
        }
        if (kpi.targets.specificUsers.length > 0) {
          const specificUsers = users.filter(user => kpi.targets.specificUsers.includes(user._id));
          targetUsers = [...targetUsers, ...specificUsers];
        }
      }

      // Remove duplicates
      targetUsers = [...new Set(targetUsers.map(user => user._id.toString()))].map(id => 
        users.find(user => user._id.toString() === id)
      );

      // Create KPIStatus entries
      for (const user of targetUsers) {
        kpiStatusEntries.push({
          user: user._id,
          kpi: kpi._id,
          status: 'pending',
          progress: 0
        });
      }
    }

    // Insert KPIStatus entries
    if (kpiStatusEntries.length > 0) {
      await KPIStatus.insertMany(kpiStatusEntries);
      console.log(`Created ${kpiStatusEntries.length} KPI status entries`);
    }

    // Update stats for all KPIs
    console.log('Updating KPI statistics...');
    const kpiIds = createdKPIs.map(kpi => kpi._id);
    await KPIStatsService.updateMultipleKPIStats(kpiIds);
    console.log('KPI statistics updated');

    // Display created KPIs by battalion and role
    console.log('\n=== KPIs BY BATTALION ===');
    const battalions = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
    battalions.forEach(battalion => {
      console.log(`\n${battalion} Battalion (${createdKPIs.filter(kpi => kpi.battalion === battalion).length} KPIs):`);
      const battalionKPIs = createdKPIs.filter(kpi => kpi.battalion === battalion);
      battalionKPIs.forEach((kpi, index) => {
        console.log(`  ${index + 1}. ${kpi.title} - ${kpi.assignedTo} (${kpi.targets.battalions.join(', ')})`);
      });
    });

    console.log('\n=== KPIs BY ROLE ===');
    const roles = ['all', 'commander', 'commando', 'specialForce', 'globalSoldier'];
    roles.forEach(role => {
      console.log(`\n${role.toUpperCase()} (${createdKPIs.filter(kpi => kpi.assignedTo === role).length} KPIs):`);
      const roleKPIs = createdKPIs.filter(kpi => kpi.assignedTo === role);
      roleKPIs.forEach((kpi, index) => {
        console.log(`  ${index + 1}. ${kpi.title} - ${kpi.battalion}`);
      });
    });

    console.log('\n=== KPIs BY CATEGORY ===');
    const categories = ['spiritual', 'ministry', 'leadership', 'personal', 'community', 'other'];
    categories.forEach(category => {
      const categoryKPIs = createdKPIs.filter(kpi => kpi.category === category);
      if (categoryKPIs.length > 0) {
        console.log(`\n${category.toUpperCase()} (${categoryKPIs.length} KPIs):`);
        categoryKPIs.forEach((kpi, index) => {
          console.log(`  ${index + 1}. ${kpi.title} - ${kpi.priority} priority`);
        });
      }
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Total KPIs created: ${createdKPIs.length}`);
    console.log(`Total KPI status entries: ${kpiStatusEntries.length}`);
    console.log(`Battalions: ${battalions.map(b => `${b} (${createdKPIs.filter(k => k.battalion === b).length})`).join(', ')}`);
    console.log(`Roles: ${roles.map(r => `${r} (${createdKPIs.filter(k => k.assignedTo === r).length})`).join(', ')}`);
    console.log(`Categories: ${categories.map(c => `${c} (${createdKPIs.filter(k => k.category === c).length})`).join(', ')}`);

    console.log('\nKPI seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding KPIs:', error);
    process.exit(1);
  }
};

// Run the seed function
seedKPIs();
