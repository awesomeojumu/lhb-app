const mongoose = require('mongoose');
const KPI = require('./models/KPI');
const User = require('./models/User');
const { CATEGORIES, PRIORITIES, STATUSES, ROLES, BATTALIONS } = require('./constants/kpiConstants');
require('dotenv').config();

// 50 KPIs distributed across battalions and roles using new structure
const kpiData = [
  // ALPHA BATTALION KPIs (12-13 KPIs)
  {
    title: "Alpha Battalion Prayer Meeting Attendance",
    description: "Achieve 90% attendance rate for weekly battalion prayer meetings",
    category: "spiritual",
    priority: "high",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Alpha Commander Strategic Planning",
    description: "Complete quarterly strategic planning session for Alpha battalion",
    category: "leadership",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-03-31')
  },
  {
    title: "Alpha Commando Training Completion",
    description: "Complete advanced spiritual warfare training program",
    category: "spiritual",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-06-30')
  },
  {
    title: "Alpha Special Force Outreach",
    description: "Lead 5 community outreach programs in Q1",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["specialForce"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-03-31')
  },
  {
    title: "Alpha Global Soldier Discipleship",
    description: "Complete discipleship program and mentor 2 new believers",
    category: "spiritual",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["globalSoldier"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Alpha Battalion Financial Stewardship",
    description: "Achieve 100% tithe compliance among battalion members",
    category: "spiritual",
    priority: "critical",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Alpha Commander Leadership Development",
    description: "Conduct monthly leadership training sessions for battalion officers",
    category: "leadership",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Alpha Commando Mission Readiness",
    description: "Maintain 95% mission readiness score through regular drills",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Alpha Special Force Intelligence Gathering",
    description: "Complete monthly intelligence reports on community needs",
    category: "ministry",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["specialForce"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Alpha Global Soldier Evangelism",
    description: "Share the gospel with 10 people monthly",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["globalSoldier"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Alpha Battalion Unity Building",
    description: "Organize 4 battalion unity events throughout the year",
    category: "community",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Alpha Commander Resource Management",
    description: "Optimize battalion resource allocation and utilization",
    category: "leadership",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-09-30')
  },
  {
    title: "Alpha Commando Tactical Excellence",
    description: "Achieve 100% success rate in assigned tactical operations",
    category: "ministry",
    priority: "critical",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Alpha"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },

  // BRAVO BATTALION KPIs (12-13 KPIs)
  {
    title: "Bravo Battalion Worship Excellence",
    description: "Maintain 95% worship service attendance and participation",
    category: "spiritual",
    priority: "high",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Commander Vision Casting",
    description: "Present quarterly vision updates to battalion members",
    category: "leadership",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Commando Spiritual Warfare",
    description: "Complete advanced spiritual warfare certification",
    category: "spiritual",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-08-31')
  },
  {
    title: "Bravo Special Force Community Impact",
    description: "Implement 3 community development projects",
    category: "community",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["specialForce"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Global Soldier Bible Study",
    description: "Complete 12-week intensive Bible study program",
    category: "spiritual",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["globalSoldier"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-06-30')
  },
  {
    title: "Bravo Battalion Fellowship Building",
    description: "Organize monthly fellowship activities for all members",
    category: "community",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Commander Team Building",
    description: "Conduct quarterly team building retreats",
    category: "leadership",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Commando Mission Planning",
    description: "Develop and execute 6 strategic mission plans",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Special Force Innovation",
    description: "Introduce 2 new ministry initiatives",
    category: "ministry",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["specialForce"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-10-31')
  },
  {
    title: "Bravo Global Soldier Service",
    description: "Complete 50 hours of community service",
    category: "community",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["globalSoldier"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Battalion Growth Target",
    description: "Increase battalion membership by 20%",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Commander Communication",
    description: "Maintain weekly communication with all battalion members",
    category: "leadership",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Bravo Commando Equipment Maintenance",
    description: "Ensure 100% equipment readiness and maintenance",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Bravo"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },

  // CHARLIE BATTALION KPIs (12-13 KPIs)
  {
    title: "Charlie Battalion Training Excellence",
    description: "Achieve 100% completion rate for all training programs",
    category: "spiritual",
    priority: "high",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Commander Strategic Vision",
    description: "Develop and implement 5-year strategic plan",
    category: "leadership",
    priority: "critical",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Commando Operational Readiness",
    description: "Maintain 24/7 operational readiness status",
    category: "ministry",
    priority: "critical",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Special Force Intelligence Analysis",
    description: "Provide monthly intelligence analysis reports",
    category: "ministry",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["specialForce"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Global Soldier Mentorship",
    description: "Mentor 3 new believers through discipleship program",
    category: "spiritual",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["globalSoldier"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Battalion Innovation Hub",
    description: "Establish innovation lab for ministry development",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-08-31')
  },
  {
    title: "Charlie Commander Performance Review",
    description: "Conduct quarterly performance reviews for all officers",
    category: "leadership",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Commando Crisis Response",
    description: "Develop and test emergency response protocols",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-07-31')
  },
  {
    title: "Charlie Special Force Technology Integration",
    description: "Implement new technology solutions for ministry efficiency",
    category: "ministry",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["specialForce"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-11-30')
  },
  {
    title: "Charlie Global Soldier Skill Development",
    description: "Complete 2 skill development courses",
    category: "personal",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["globalSoldier"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Battalion Community Engagement",
    description: "Establish partnerships with 5 community organizations",
    category: "community",
    priority: "high",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Commander Resource Optimization",
    description: "Achieve 15% cost reduction through resource optimization",
    category: "leadership",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Charlie Commando Special Operations",
    description: "Execute 4 special operations successfully",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Charlie"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },

  // DELTA BATTALION KPIs (12-13 KPIs)
  {
    title: "Delta Battalion Excellence Standard",
    description: "Maintain 98% excellence rating in all activities",
    category: "spiritual",
    priority: "critical",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Commander Legacy Building",
    description: "Establish lasting legacy programs for future generations",
    category: "leadership",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Commando Elite Training",
    description: "Complete elite commando certification program",
    category: "spiritual",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-09-30')
  },
  {
    title: "Delta Special Force Strategic Intelligence",
    description: "Develop comprehensive intelligence network",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["specialForce"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Global Soldier Leadership Development",
    description: "Complete leadership development program",
    category: "leadership",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["globalSoldier"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Battalion Cultural Transformation",
    description: "Lead cultural transformation initiatives in community",
    category: "community",
    priority: "critical",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Commander Succession Planning",
    description: "Develop and implement succession planning strategy",
    category: "leadership",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Commando Advanced Tactics",
    description: "Master advanced tactical procedures and protocols",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Special Force Innovation Leadership",
    description: "Lead innovation initiatives across all battalions",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: ["specialForce"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Global Soldier Impact Measurement",
    description: "Develop and implement impact measurement system",
    category: "ministry",
    priority: "medium",
    targets: {
      allUsers: false,
      roles: ["globalSoldier"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Battalion Global Influence",
    description: "Establish international ministry partnerships",
    category: "ministry",
    priority: "high",
    targets: {
      allUsers: false,
      roles: [],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Commander Excellence Benchmark",
    description: "Set new excellence benchmarks for all battalions",
    category: "leadership",
    priority: "critical",
    targets: {
      allUsers: false,
      roles: ["commander"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  },
  {
    title: "Delta Commando Mission Mastery",
    description: "Achieve 100% mission success rate",
    category: "ministry",
    priority: "critical",
    targets: {
      allUsers: false,
      roles: ["commando"],
      battalions: ["Delta"],
      specificUsers: []
    },
    deadline: new Date('2026-12-31')
  }
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
        createdBy: randomUser._id,
        status: 'active',
        isPublic: true,
        isDeleted: false
      };
    });

    // Insert KPIs into database
    const createdKPIs = await KPI.insertMany(kpisWithCreators);
    console.log(`Successfully created ${createdKPIs.length} KPIs`);

    // Display created KPIs by battalion and role
    console.log('\n=== KPIs BY BATTALION ===');
    const battalions = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
    battalions.forEach(battalion => {
      const battalionKPIs = createdKPIs.filter(kpi => 
        kpi.targets.battalions.includes(battalion)
      );
      console.log(`\n${battalion} Battalion (${battalionKPIs.length} KPIs):`);
      battalionKPIs.forEach((kpi, index) => {
        const roles = kpi.targets.roles.length > 0 ? kpi.targets.roles.join(', ') : 'All roles';
        console.log(`  ${index + 1}. ${kpi.title} - ${roles}`);
      });
    });

    console.log('\n=== KPIs BY ROLE ===');
    const roles = ['commander', 'commando', 'specialForce', 'globalSoldier'];
    roles.forEach(role => {
      const roleKPIs = createdKPIs.filter(kpi => 
        kpi.targets.roles.includes(role)
      );
      console.log(`\n${role.toUpperCase()} (${roleKPIs.length} KPIs):`);
      roleKPIs.forEach((kpi, index) => {
        const battalions = kpi.targets.battalions.join(', ');
        console.log(`  ${index + 1}. ${kpi.title} - ${battalions}`);
      });
    });

    console.log('\n=== KPIs BY CATEGORY ===');
    const categories = ['spiritual', 'ministry', 'leadership', 'personal', 'community', 'other'];
    categories.forEach(category => {
      const categoryKPIs = createdKPIs.filter(kpi => kpi.category === category);
      console.log(`\n${category.toUpperCase()} (${categoryKPIs.length} KPIs):`);
      categoryKPIs.forEach((kpi, index) => {
        console.log(`  ${index + 1}. ${kpi.title}`);
      });
    });

    console.log('\n=== KPIs BY PRIORITY ===');
    const priorities = ['low', 'medium', 'high', 'critical'];
    priorities.forEach(priority => {
      const priorityKPIs = createdKPIs.filter(kpi => kpi.priority === priority);
      console.log(`\n${priority.toUpperCase()} (${priorityKPIs.length} KPIs):`);
      priorityKPIs.forEach((kpi, index) => {
        console.log(`  ${index + 1}. ${kpi.title}`);
      });
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Total KPIs created: ${createdKPIs.length}`);
    console.log(`Battalions: ${battalions.map(b => {
      const count = createdKPIs.filter(k => k.targets.battalions.includes(b)).length;
      return `${b} (${count})`;
    }).join(', ')}`);
    console.log(`Roles: ${roles.map(r => {
      const count = createdKPIs.filter(k => k.targets.roles.includes(r)).length;
      return `${r} (${count})`;
    }).join(', ')}`);
    console.log(`Categories: ${categories.map(c => {
      const count = createdKPIs.filter(k => k.category === c).length;
      return `${c} (${count})`;
    }).join(', ')}`);
    console.log(`Priorities: ${priorities.map(p => {
      const count = createdKPIs.filter(k => k.priority === p).length;
      return `${p} (${count})`;
    }).join(', ')}`);

    console.log('\nKPI seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding KPIs:', error);
    process.exit(1);
  }
};

// Run the seed function
seedKPIs();