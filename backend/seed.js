const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const KPI = require('./models/KPI');
require('dotenv').config();

// 20 users evenly distributed:
// Roles: 5 commanders, 5 commandos, 5 specialForce, 5 globalSoldiers
// Battalions: 5 Alpha, 5 Bravo, 5 Charlie, 5 Delta
const usersData = [
  // ALPHA BATTALION (5 users)
  {
    firstName: 'John',
    lastName: 'Commander',
    email: 'john.commander@lhb.com',
    phone: '+2348012345678',
    sex: 'Male',
    ageBracket: '36-45',
    dateOfBirth: new Date('1985-03-15'),
    battalion: 'Alpha',
    lhbCode: 'LHB-ALPHA-001',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2015-06-20'),
    address: '123 Victory Street, Lagos',
    country: 'Nigeria',
    personalityType: 'Leader',
    fiveFoldGift: 'Apostle',
    leadershipRoles: ['Battalion Commander', 'Prayer Leader'],
    education: 'Masters',
    jobStatus: 'Employed',
    incomeRange: '500,000 - 1,000,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Government',
    secondaryMountain: 'Education',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'commander',
    password: 'Commander123!'
  },
  {
    firstName: 'Sarah',
    lastName: 'Commando',
    email: 'sarah.commando@lhb.com',
    phone: '+2348023456789',
    sex: 'Female',
    ageBracket: '26-35',
    dateOfBirth: new Date('1992-07-22'),
    battalion: 'Alpha',
    lhbCode: 'LHB-ALPHA-002',
    relationshipStatus: 'Single',
    address: '456 Faith Avenue, Abuja',
    country: 'Nigeria',
    personalityType: 'Warrior',
    fiveFoldGift: 'Prophet',
    leadershipRoles: ['Youth Leader', 'Worship Leader'],
    education: 'Bachelors',
    jobStatus: 'Self Employed',
    incomeRange: '200,000 - 500,000',
    purposeStatus: 'In Progress',
    primaryMountain: 'Media',
    secondaryMountain: 'Arts',
    purposeBootcampCompleted: false,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: false,
    hasDriversLicense: true,
    role: 'commando',
    password: 'Commando123!'
  },
  {
    firstName: 'Michael',
    lastName: 'SpecialForce',
    email: 'michael.special@lhb.com',
    phone: '+2348034567890',
    sex: 'Male',
    ageBracket: '26-35',
    dateOfBirth: new Date('1990-11-08'),
    battalion: 'Alpha',
    lhbCode: 'LHB-ALPHA-003',
    relationshipStatus: 'Engaged',
    address: '789 Hope Road, Port Harcourt',
    country: 'Nigeria',
    personalityType: 'Strategist',
    fiveFoldGift: 'Teacher',
    leadershipRoles: ['Bible Study Leader'],
    education: 'HND',
    jobStatus: 'Employed',
    incomeRange: '300,000 - 500,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Business',
    secondaryMountain: 'Family',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: false,
    role: 'specialForce',
    password: 'Special123!'
  },
  {
    firstName: 'Grace',
    lastName: 'Soldier',
    email: 'grace.soldier@lhb.com',
    phone: '+2348045678901',
    sex: 'Female',
    ageBracket: '18-25',
    dateOfBirth: new Date('2000-01-14'),
    battalion: 'Alpha',
    lhbCode: 'LHB-ALPHA-004',
    relationshipStatus: 'Single',
    address: '321 Grace Street, Ibadan',
    country: 'Nigeria',
    personalityType: 'Helper',
    fiveFoldGift: 'Pastor',
    leadershipRoles: ['Children Ministry'],
    education: 'SSCE',
    jobStatus: 'Unemployed',
    incomeRange: 'Below 100,000',
    purposeStatus: 'Not Yet Discovered',
    primaryMountain: 'Family',
    secondaryMountain: 'Religion',
    purposeBootcampCompleted: false,
    discipleshipCompleted: false,
    hasVoterCard: false,
    hasPassport: false,
    hasDriversLicense: false,
    role: 'globalSoldier',
    password: 'Soldier123!'
  },
  {
    firstName: 'David',
    lastName: 'Warrior',
    email: 'david.warrior@lhb.com',
    phone: '+2348056789012',
    sex: 'Male',
    ageBracket: '36-45',
    dateOfBirth: new Date('1988-09-30'),
    battalion: 'Alpha',
    lhbCode: 'LHB-ALPHA-005',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2018-12-15'),
    address: '654 Victory Lane, Kano',
    country: 'Nigeria',
    personalityType: 'Fighter',
    fiveFoldGift: 'Evangelist',
    leadershipRoles: ['Outreach Coordinator', 'Men\'s Ministry'],
    education: 'OND',
    jobStatus: 'Contract',
    incomeRange: '150,000 - 300,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Religion',
    secondaryMountain: 'Media',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'globalSoldier',
    password: 'Warrior123!'
  },

  // BRAVO BATTALION (5 users)
  {
    firstName: 'Esther',
    lastName: 'Queen',
    email: 'esther.queen@lhb.com',
    phone: '+2348067890123',
    sex: 'Female',
    ageBracket: '26-35',
    dateOfBirth: new Date('1995-04-12'),
    battalion: 'Bravo',
    lhbCode: 'LHB-BRAVO-001',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2020-08-22'),
    address: '987 Royal Street, Enugu',
    country: 'Nigeria',
    personalityType: 'Royal',
    fiveFoldGift: 'Pastor',
    leadershipRoles: ['Women\'s Ministry', 'Marriage Counselor'],
    education: 'Bachelors',
    jobStatus: 'Employed',
    incomeRange: '400,000 - 600,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Family',
    secondaryMountain: 'Education',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'commander',
    password: 'Queen123!'
  },
  {
    firstName: 'Peter',
    lastName: 'Rock',
    email: 'peter.rock@lhb.com',
    phone: '+2348078901234',
    sex: 'Male',
    ageBracket: '46-60',
    dateOfBirth: new Date('1978-06-25'),
    battalion: 'Bravo',
    lhbCode: 'LHB-BRAVO-002',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2005-03-10'),
    address: '147 Foundation Road, Calabar',
    country: 'Nigeria',
    personalityType: 'Foundation',
    fiveFoldGift: 'Apostle',
    leadershipRoles: ['Elder', 'Mentor', 'Church Board Member'],
    education: 'PhD',
    jobStatus: 'Self Employed',
    incomeRange: '1,000,000+',
    purposeStatus: 'Discovered',
    primaryMountain: 'Religion',
    secondaryMountain: 'Education',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'commando',
    password: 'Rock123!'
  },
  {
    firstName: 'Ruth',
    lastName: 'Faithful',
    email: 'ruth.faithful@lhb.com',
    phone: '+2348089012345',
    sex: 'Female',
    ageBracket: '26-35',
    dateOfBirth: new Date('1993-12-03'),
    battalion: 'Bravo',
    lhbCode: 'LHB-BRAVO-003',
    relationshipStatus: 'Single',
    address: '258 Loyalty Street, Benin',
    country: 'Nigeria',
    personalityType: 'Faithful',
    fiveFoldGift: 'Teacher',
    leadershipRoles: ['Sunday School Teacher', 'Prayer Coordinator'],
    education: 'HND',
    jobStatus: 'Employed',
    incomeRange: '250,000 - 400,000',
    purposeStatus: 'In Progress',
    primaryMountain: 'Education',
    secondaryMountain: 'Family',
    purposeBootcampCompleted: false,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: false,
    hasDriversLicense: true,
    role: 'specialForce',
    password: 'Faithful123!'
  },
  {
    firstName: 'Daniel',
    lastName: 'Prophet',
    email: 'daniel.prophet@lhb.com',
    phone: '+2348090123456',
    sex: 'Male',
    ageBracket: '18-25',
    dateOfBirth: new Date('1999-08-17'),
    battalion: 'Bravo',
    lhbCode: 'LHB-BRAVO-004',
    relationshipStatus: 'Single',
    address: '369 Vision Avenue, Jos',
    country: 'Nigeria',
    personalityType: 'Visionary',
    fiveFoldGift: 'Prophet',
    leadershipRoles: ['Prophetic Team', 'Intercessor'],
    education: 'Bachelors',
    jobStatus: 'Employed',
    incomeRange: '200,000 - 350,000',
    purposeStatus: 'In Progress',
    primaryMountain: 'Religion',
    secondaryMountain: 'Media',
    purposeBootcampCompleted: false,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: false,
    role: 'globalSoldier',
    password: 'Prophet123!'
  },
  {
    firstName: 'Mary',
    lastName: 'Chosen',
    email: 'mary.chosen@lhb.com',
    phone: '+2348001234567',
    sex: 'Female',
    ageBracket: '36-45',
    dateOfBirth: new Date('1987-05-20'),
    battalion: 'Bravo',
    lhbCode: 'LHB-BRAVO-005',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2012-11-05'),
    address: '741 Chosen Street, Owerri',
    country: 'Nigeria',
    personalityType: 'Chosen',
    fiveFoldGift: 'Pastor',
    leadershipRoles: ['Pastor\'s Wife', 'Ministry Coordinator'],
    education: 'Masters',
    jobStatus: 'Self Employed',
    incomeRange: '300,000 - 500,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Family',
    secondaryMountain: 'Religion',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'globalSoldier',
    password: 'Chosen123!'
  },

  // CHARLIE BATTALION (5 users)
  {
    firstName: 'James',
    lastName: 'Leader',
    email: 'james.leader@lhb.com',
    phone: '+2348011111111',
    sex: 'Male',
    ageBracket: '36-45',
    dateOfBirth: new Date('1983-02-14'),
    battalion: 'Charlie',
    lhbCode: 'LHB-CHARLIE-001',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2010-05-20'),
    address: '555 Leadership Drive, Kaduna',
    country: 'Nigeria',
    personalityType: 'Commander',
    fiveFoldGift: 'Apostle',
    leadershipRoles: ['Battalion Leader', 'Strategic Planner'],
    education: 'Masters',
    jobStatus: 'Employed',
    incomeRange: '600,000 - 800,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Government',
    secondaryMountain: 'Business',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'commander',
    password: 'Leader123!'
  },
  {
    firstName: 'Rebecca',
    lastName: 'Elite',
    email: 'rebecca.elite@lhb.com',
    phone: '+2348022222222',
    sex: 'Female',
    ageBracket: '26-35',
    dateOfBirth: new Date('1991-09-03'),
    battalion: 'Charlie',
    lhbCode: 'LHB-CHARLIE-002',
    relationshipStatus: 'Single',
    address: '777 Elite Street, Uyo',
    country: 'Nigeria',
    personalityType: 'Elite',
    fiveFoldGift: 'Prophet',
    leadershipRoles: ['Elite Team Leader', 'Vision Coordinator'],
    education: 'Bachelors',
    jobStatus: 'Self Employed',
    incomeRange: '350,000 - 550,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Media',
    secondaryMountain: 'Arts',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'commando',
    password: 'Elite123!'
  },
  {
    firstName: 'Samuel',
    lastName: 'Tactical',
    email: 'samuel.tactical@lhb.com',
    phone: '+2348033333333',
    sex: 'Male',
    ageBracket: '26-35',
    dateOfBirth: new Date('1989-12-18'),
    battalion: 'Charlie',
    lhbCode: 'LHB-CHARLIE-003',
    relationshipStatus: 'Engaged',
    address: '888 Tactical Road, Abeokuta',
    country: 'Nigeria',
    personalityType: 'Tactician',
    fiveFoldGift: 'Teacher',
    leadershipRoles: ['Tactical Coordinator', 'Training Leader'],
    education: 'HND',
    jobStatus: 'Employed',
    incomeRange: '280,000 - 450,000',
    purposeStatus: 'In Progress',
    primaryMountain: 'Education',
    secondaryMountain: 'Business',
    purposeBootcampCompleted: false,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'specialForce',
    password: 'Tactical123!'
  },
  {
    firstName: 'Hannah',
    lastName: 'Guardian',
    email: 'hannah.guardian@lhb.com',
    phone: '+2348044444444',
    sex: 'Female',
    ageBracket: '18-25',
    dateOfBirth: new Date('2001-06-25'),
    battalion: 'Charlie',
    lhbCode: 'LHB-CHARLIE-004',
    relationshipStatus: 'Single',
    address: '999 Guardian Lane, Akure',
    country: 'Nigeria',
    personalityType: 'Guardian',
    fiveFoldGift: 'Pastor',
    leadershipRoles: ['Guardian Team', 'Care Ministry'],
    education: 'SSCE',
    jobStatus: 'Unemployed',
    incomeRange: 'Below 100,000',
    purposeStatus: 'Not Yet Discovered',
    primaryMountain: 'Family',
    secondaryMountain: 'Religion',
    purposeBootcampCompleted: false,
    discipleshipCompleted: false,
    hasVoterCard: false,
    hasPassport: false,
    hasDriversLicense: false,
    role: 'globalSoldier',
    password: 'Guardian123!'
  },
  {
    firstName: 'Caleb',
    lastName: 'Defender',
    email: 'caleb.defender@lhb.com',
    phone: '+2348055555555',
    sex: 'Male',
    ageBracket: '36-45',
    dateOfBirth: new Date('1986-04-10'),
    battalion: 'Charlie',
    lhbCode: 'LHB-CHARLIE-005',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2016-09-15'),
    address: '111 Defender Street, Minna',
    country: 'Nigeria',
    personalityType: 'Defender',
    fiveFoldGift: 'Evangelist',
    leadershipRoles: ['Defense Coordinator', 'Men\'s Ministry'],
    education: 'OND',
    jobStatus: 'Contract',
    incomeRange: '180,000 - 320,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Religion',
    secondaryMountain: 'Family',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'globalSoldier',
    password: 'Defender123!'
  },

  // DELTA BATTALION (5 users)
  {
    firstName: 'Deborah',
    lastName: 'Judge',
    email: 'deborah.judge@lhb.com',
    phone: '+2348066666666',
    sex: 'Female',
    ageBracket: '46-60',
    dateOfBirth: new Date('1975-11-30'),
    battalion: 'Delta',
    lhbCode: 'LHB-DELTA-001',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2000-03-08'),
    address: '222 Justice Avenue, Bauchi',
    country: 'Nigeria',
    personalityType: 'Judge',
    fiveFoldGift: 'Apostle',
    leadershipRoles: ['Battalion Judge', 'Elder', 'Mentor'],
    education: 'PhD',
    jobStatus: 'Self Employed',
    incomeRange: '800,000 - 1,200,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Government',
    secondaryMountain: 'Religion',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'commander',
    password: 'Judge123!'
  },
  {
    firstName: 'Joshua',
    lastName: 'Conqueror',
    email: 'joshua.conqueror@lhb.com',
    phone: '+2348077777777',
    sex: 'Male',
    ageBracket: '26-35',
    dateOfBirth: new Date('1994-01-22'),
    battalion: 'Delta',
    lhbCode: 'LHB-DELTA-002',
    relationshipStatus: 'Single',
    address: '333 Conquest Road, Sokoto',
    country: 'Nigeria',
    personalityType: 'Conqueror',
    fiveFoldGift: 'Prophet',
    leadershipRoles: ['Conquest Team Leader', 'Victory Coordinator'],
    education: 'Bachelors',
    jobStatus: 'Employed',
    incomeRange: '400,000 - 600,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Business',
    secondaryMountain: 'Media',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'commando',
    password: 'Conqueror123!'
  },
  {
    firstName: 'Miriam',
    lastName: 'Worshipper',
    email: 'miriam.worshipper@lhb.com',
    phone: '+2348088888888',
    sex: 'Female',
    ageBracket: '26-35',
    dateOfBirth: new Date('1992-07-14'),
    battalion: 'Delta',
    lhbCode: 'LHB-DELTA-003',
    relationshipStatus: 'Engaged',
    address: '444 Worship Street, Maiduguri',
    country: 'Nigeria',
    personalityType: 'Worshipper',
    fiveFoldGift: 'Teacher',
    leadershipRoles: ['Worship Leader', 'Music Coordinator'],
    education: 'HND',
    jobStatus: 'Self Employed',
    incomeRange: '250,000 - 400,000',
    purposeStatus: 'In Progress',
    primaryMountain: 'Arts',
    secondaryMountain: 'Religion',
    purposeBootcampCompleted: false,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: false,
    hasDriversLicense: true,
    role: 'specialForce',
    password: 'Worshipper123!'
  },
  {
    firstName: 'Aaron',
    lastName: 'Priest',
    email: 'aaron.priest@lhb.com',
    phone: '+2348099999999',
    sex: 'Male',
    ageBracket: '18-25',
    dateOfBirth: new Date('2002-03-05'),
    battalion: 'Delta',
    lhbCode: 'LHB-DELTA-004',
    relationshipStatus: 'Single',
    address: '555 Priesthood Lane, Yola',
    country: 'Nigeria',
    personalityType: 'Priest',
    fiveFoldGift: 'Pastor',
    leadershipRoles: ['Priesthood Team', 'Prayer Ministry'],
    education: 'SSCE',
    jobStatus: 'Unemployed',
    incomeRange: 'Below 100,000',
    purposeStatus: 'Not Yet Discovered',
    primaryMountain: 'Religion',
    secondaryMountain: 'Family',
    purposeBootcampCompleted: false,
    discipleshipCompleted: false,
    hasVoterCard: false,
    hasPassport: false,
    hasDriversLicense: false,
    role: 'globalSoldier',
    password: 'Priest123!'
  },
  {
    firstName: 'Naomi',
    lastName: 'Wisdom',
    email: 'naomi.wisdom@lhb.com',
    phone: '+2348000000000',
    sex: 'Female',
    ageBracket: '36-45',
    dateOfBirth: new Date('1984-10-12'),
    battalion: 'Delta',
    lhbCode: 'LHB-DELTA-005',
    relationshipStatus: 'Married',
    weddingAnniversary: new Date('2014-12-01'),
    address: '666 Wisdom Avenue, Makurdi',
    country: 'Nigeria',
    personalityType: 'Wise',
    fiveFoldGift: 'Evangelist',
    leadershipRoles: ['Wisdom Council', 'Counselor'],
    education: 'Masters',
    jobStatus: 'Employed',
    incomeRange: '350,000 - 550,000',
    purposeStatus: 'Discovered',
    primaryMountain: 'Education',
    secondaryMountain: 'Family',
    purposeBootcampCompleted: true,
    discipleshipCompleted: true,
    hasVoterCard: true,
    hasPassport: true,
    hasDriversLicense: true,
    role: 'globalSoldier',
    password: 'Wisdom123!'
  }
];

// 50 KPIs distributed across battalions and roles
const kpiData = [
  // ALPHA BATTALION KPIs (13 KPIs)
  {
    title: "Alpha Battalion Prayer Meeting Attendance",
    description: "Achieve 90% attendance rate for weekly battalion prayer meetings",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Commander Strategic Planning",
    description: "Complete quarterly strategic planning session for Alpha battalion",
    assignedTo: "commander",
    deadline: new Date('2024-03-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Commando Training Completion",
    description: "Complete advanced spiritual warfare training program",
    assignedTo: "commando",
    deadline: new Date('2024-06-30'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Special Force Outreach",
    description: "Lead 5 community outreach programs in Q1",
    assignedTo: "specialForce",
    deadline: new Date('2024-03-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Global Soldier Discipleship",
    description: "Complete discipleship program and mentor 2 new believers",
    assignedTo: "globalSoldier",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Battalion Financial Stewardship",
    description: "Achieve 100% tithe compliance among battalion members",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Commander Leadership Development",
    description: "Conduct monthly leadership training sessions for battalion officers",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Commando Mission Readiness",
    description: "Maintain 95% mission readiness score through regular drills",
    assignedTo: "commando",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Special Force Intelligence Gathering",
    description: "Complete monthly intelligence reports on community needs",
    assignedTo: "specialForce",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Global Soldier Evangelism",
    description: "Share the gospel with 10 people monthly",
    assignedTo: "globalSoldier",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Battalion Unity Building",
    description: "Organize 4 battalion unity events throughout the year",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Commander Resource Management",
    description: "Optimize battalion resource allocation and utilization",
    assignedTo: "commander",
    deadline: new Date('2024-09-30'),
    battalion: "Alpha"
  },
  {
    title: "Alpha Commando Tactical Excellence",
    description: "Achieve 100% success rate in assigned tactical operations",
    assignedTo: "commando",
    deadline: new Date('2024-12-31'),
    battalion: "Alpha"
  },

  // BRAVO BATTALION KPIs (13 KPIs)
  {
    title: "Bravo Battalion Worship Excellence",
    description: "Maintain 95% worship service attendance and participation",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Commander Vision Casting",
    description: "Present quarterly vision updates to battalion members",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Commando Spiritual Warfare",
    description: "Complete advanced spiritual warfare certification",
    assignedTo: "commando",
    deadline: new Date('2024-08-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Special Force Community Impact",
    description: "Implement 3 community development projects",
    assignedTo: "specialForce",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Global Soldier Bible Study",
    description: "Complete 12-week intensive Bible study program",
    assignedTo: "globalSoldier",
    deadline: new Date('2024-06-30'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Battalion Fellowship Building",
    description: "Organize monthly fellowship activities for all members",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Commander Team Building",
    description: "Conduct quarterly team building retreats",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Commando Mission Planning",
    description: "Develop and execute 6 strategic mission plans",
    assignedTo: "commando",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Special Force Innovation",
    description: "Introduce 2 new ministry initiatives",
    assignedTo: "specialForce",
    deadline: new Date('2024-10-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Global Soldier Service",
    description: "Complete 50 hours of community service",
    assignedTo: "globalSoldier",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Battalion Growth Target",
    description: "Increase battalion membership by 20%",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Commander Communication",
    description: "Maintain weekly communication with all battalion members",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },
  {
    title: "Bravo Commando Equipment Maintenance",
    description: "Ensure 100% equipment readiness and maintenance",
    assignedTo: "commando",
    deadline: new Date('2024-12-31'),
    battalion: "Bravo"
  },

  // CHARLIE BATTALION KPIs (12 KPIs)
  {
    title: "Charlie Battalion Training Excellence",
    description: "Achieve 100% completion rate for all training programs",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Commander Strategic Vision",
    description: "Develop and implement 5-year strategic plan",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Commando Operational Readiness",
    description: "Maintain 24/7 operational readiness status",
    assignedTo: "commando",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Special Force Intelligence Analysis",
    description: "Provide monthly intelligence analysis reports",
    assignedTo: "specialForce",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Global Soldier Mentorship",
    description: "Mentor 3 new believers through discipleship program",
    assignedTo: "globalSoldier",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Battalion Innovation Hub",
    description: "Establish innovation lab for ministry development",
    assignedTo: "all",
    deadline: new Date('2024-08-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Commander Performance Review",
    description: "Conduct quarterly performance reviews for all officers",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Commando Crisis Response",
    description: "Develop and test emergency response protocols",
    assignedTo: "commando",
    deadline: new Date('2024-07-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Special Force Technology Integration",
    description: "Implement new technology solutions for ministry efficiency",
    assignedTo: "specialForce",
    deadline: new Date('2024-11-30'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Global Soldier Skill Development",
    description: "Complete 2 skill development courses",
    assignedTo: "globalSoldier",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Battalion Community Engagement",
    description: "Establish partnerships with 5 community organizations",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },
  {
    title: "Charlie Commander Resource Optimization",
    description: "Achieve 15% cost reduction through resource optimization",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Charlie"
  },

  // DELTA BATTALION KPIs (12 KPIs)
  {
    title: "Delta Battalion Excellence Standard",
    description: "Maintain 98% excellence rating in all activities",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Commander Legacy Building",
    description: "Establish lasting legacy programs for future generations",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Commando Elite Training",
    description: "Complete elite commando certification program",
    assignedTo: "commando",
    deadline: new Date('2024-09-30'),
    battalion: "Delta"
  },
  {
    title: "Delta Special Force Strategic Intelligence",
    description: "Develop comprehensive intelligence network",
    assignedTo: "specialForce",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Global Soldier Leadership Development",
    description: "Complete leadership development program",
    assignedTo: "globalSoldier",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Battalion Cultural Transformation",
    description: "Lead cultural transformation initiatives in community",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Commander Succession Planning",
    description: "Develop and implement succession planning strategy",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Commando Advanced Tactics",
    description: "Master advanced tactical procedures and protocols",
    assignedTo: "commando",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Special Force Innovation Leadership",
    description: "Lead innovation initiatives across all battalions",
    assignedTo: "specialForce",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Global Soldier Impact Measurement",
    description: "Develop and implement impact measurement system",
    assignedTo: "globalSoldier",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Battalion Global Influence",
    description: "Establish international ministry partnerships",
    assignedTo: "all",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  },
  {
    title: "Delta Commander Excellence Benchmark",
    description: "Set new excellence benchmarks for all battalions",
    assignedTo: "commander",
    deadline: new Date('2024-12-31'),
    battalion: "Delta"
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - remove this if you want to keep existing data)
    await User.deleteMany({});
    await KPI.deleteMany({});
    console.log('Cleared existing users and KPIs');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      usersData.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );

    // Insert users into database
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Successfully created ${createdUsers.length} users`);

    // Assign creators to KPIs (randomly assign from created users)
    const kpisWithCreators = kpiData.map(kpi => {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      return {
        ...kpi,
        createdBy: randomUser._id
      };
    });

    // Insert KPIs into database
    const createdKPIs = await KPI.insertMany(kpisWithCreators);
    console.log(`Successfully created ${createdKPIs.length} KPIs`);

    // Display created users by battalion and role
    console.log('\n=== USERS BY BATTALION ===');
    const battalions = ['Alpha', 'Bravo', 'Charlie', 'Delta'];
    battalions.forEach(battalion => {
      console.log(`\n${battalion} Battalion:`);
      const battalionUsers = createdUsers.filter(user => user.battalion === battalion);
      battalionUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} - ${user.role} (${user.email})`);
      });
    });

    console.log('\n=== USERS BY ROLE ===');
    const roles = ['commander', 'commando', 'specialForce', 'globalSoldier'];
    roles.forEach(role => {
      console.log(`\n${role.toUpperCase()} (${createdUsers.filter(user => user.role === role).length} users):`);
      const roleUsers = createdUsers.filter(user => user.role === role);
      roleUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} - ${user.battalion} (${user.email})`);
      });
    });

    console.log('\n=== KPIs BY BATTALION ===');
    battalions.forEach(battalion => {
      console.log(`\n${battalion} Battalion (${createdKPIs.filter(kpi => kpi.battalion === battalion).length} KPIs):`);
      const battalionKPIs = createdKPIs.filter(kpi => kpi.battalion === battalion);
      battalionKPIs.forEach((kpi, index) => {
        console.log(`  ${index + 1}. ${kpi.title} - ${kpi.assignedTo}`);
      });
    });

    console.log('\n=== KPIs BY ROLE ===');
    const kpiRoles = ['all', 'commander', 'commando', 'specialForce', 'globalSoldier'];
    kpiRoles.forEach(role => {
      console.log(`\n${role.toUpperCase()} (${createdKPIs.filter(kpi => kpi.assignedTo === role).length} KPIs):`);
      const roleKPIs = createdKPIs.filter(kpi => kpi.assignedTo === role);
      roleKPIs.forEach((kpi, index) => {
        console.log(`  ${index + 1}. ${kpi.title} - ${kpi.battalion}`);
      });
    });

    console.log('\n=== SUMMARY ===');
    console.log(`Total users created: ${createdUsers.length}`);
    console.log(`Total KPIs created: ${createdKPIs.length}`);
    console.log(`Battalions: ${battalions.map(b => `${b} (${createdUsers.filter(u => u.battalion === b).length} users, ${createdKPIs.filter(k => k.battalion === b).length} KPIs)`).join(', ')}`);
    console.log(`Roles: ${roles.map(r => `${r} (${createdUsers.filter(u => u.role === r).length} users, ${createdKPIs.filter(k => k.assignedTo === r).length} KPIs)`).join(', ')}`);

    console.log('\nDatabase seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();