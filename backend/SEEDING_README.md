# Database Seeding Guide

This guide explains how to use the database seeding scripts for the LHB application.

## Overview

The seeding system creates sample data for testing and development purposes, including:
- 20 users distributed across 4 battalions (Alpha, Bravo, Charlie, Delta)
- 50 KPIs distributed across battalions and roles
- Proper role assignments and relationships

## Files

- `seed.js` - Main seeding script (users + KPIs)
- `seedKPIs.js` - KPI-only seeding script
- `runKpiSeed.js` - Standalone KPI seeding script

## Prerequisites

1. Ensure MongoDB is running
2. Set up your `.env` file with `MONGO_URI`
3. Install dependencies: `npm install`

## Usage

### Option 1: Seed Everything (Recommended)

```bash
# Seed both users and KPIs
node seed.js
```

This will:
- Clear existing users and KPIs
- Create 20 users across 4 battalions
- Create 50 KPIs distributed across battalions and roles
- Display detailed summary

### Option 2: Seed KPIs Only

```bash
# Seed only KPIs (requires existing users)
node runKpiSeed.js
```

This will:
- Clear existing KPIs
- Create 50 KPIs
- Assign random creators from existing users
- Display KPI summary

### Option 3: Use Separate KPI Script

```bash
# Alternative KPI seeding
node seedKPIs.js
```

## Data Distribution

### Users (20 total)
- **Battalions**: 5 users each (Alpha, Bravo, Charlie, Delta)
- **Roles**: 5 users each (commander, commando, specialForce, globalSoldier)

### KPIs (50 total)
- **Alpha Battalion**: 13 KPIs
- **Bravo Battalion**: 13 KPIs  
- **Charlie Battalion**: 12 KPIs
- **Delta Battalion**: 12 KPIs

### KPI Role Distribution
- **All users**: 8 KPIs
- **Commanders**: 12 KPIs
- **Commandos**: 12 KPIs
- **Special Force**: 9 KPIs
- **Global Soldiers**: 9 KPIs

## KPI Categories

The KPIs cover various aspects of ministry and operations:

### Spiritual Goals
- Prayer meeting attendance
- Worship excellence
- Bible study completion
- Discipleship programs
- Evangelism targets

### Administrative Goals
- Strategic planning
- Resource management
- Performance reviews
- Communication standards
- Financial stewardship

### Operational Goals
- Training completion
- Mission readiness
- Community outreach
- Innovation initiatives
- Leadership development

## Sample Data

### User Examples
- John Commander (Alpha, commander)
- Sarah Commando (Alpha, commando)
- Michael SpecialForce (Alpha, specialForce)
- Grace Soldier (Alpha, globalSoldier)

### KPI Examples
- "Alpha Battalion Prayer Meeting Attendance" (all, Alpha)
- "Bravo Commander Vision Casting" (commander, Bravo)
- "Charlie Commando Operational Readiness" (commando, Charlie)
- "Delta Special Force Strategic Intelligence" (specialForce, Delta)

## Troubleshooting

### Common Issues

1. **"No users found" error**
   - Run `node seed.js` first to create users
   - Or ensure users exist in the database

2. **MongoDB connection error**
   - Check your `.env` file has correct `MONGO_URI`
   - Ensure MongoDB is running

3. **Permission errors**
   - Ensure you have write access to the database
   - Check MongoDB user permissions

### Reset Database

To completely reset and reseed:

```bash
# Clear everything and start fresh
node seed.js
```

## Development Notes

- All passwords are hashed using bcrypt
- KPIs are randomly assigned creators from existing users
- Dates are set for 2024 with various deadlines
- Battalion assignments follow the existing schema
- Role assignments match the user role enum values

## Customization

To modify the seed data:

1. Edit the `usersData` array in `seed.js` for user changes
2. Edit the `kpiData` array in `seed.js` for KPI changes
3. Adjust distribution numbers as needed
4. Update descriptions and deadlines as required

## Production Warning

⚠️ **Never run seeding scripts in production!** These scripts are designed for development and testing only.
