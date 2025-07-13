const mongoose = require('mongoose');

/**
 * User Schema
 *
 * This schema defines the structure for user documents in the database.
 * It captures personal, spiritual, and administrative details for each user.
 *
 * Fields:
 * - firstName:           User's first name (required).
 * - lastName:            User's last name (required).
 * - email:               User's email address (required, should be unique).
 * - phone:               User's phone number (optional).
 * - sex:                 Gender of the user ('Male' or 'Female').
 * - ageBracket:          Age group of the user (enum).
 * - dateOfBirth:         User's date of birth (optional).
 * - battalion:           User's battalion assignment (enum).
 * - lhbCode:             Unique code for the user (optional).
 * - relationshipStatus:  Marital status (enum).
 * - weddingAnniversary:  Date of wedding anniversary (optional).
 * - address:             Home address (optional).
 * - country:             Country of residence (optional).
 * - personalityType:     User's personality type (optional).
 * - fiveFoldGift:        Spiritual gift (enum).
 * - leadershipRoles:     Array of leadership roles (optional).
 * - education:           Highest education level (enum).
 * - jobStatus:           Employment status (enum).
 * - incomeRange:         Income range (optional).
 * - purposeStatus:       Status of purpose discovery (enum).
 * - primaryMountain:     Primary mountain of influence (optional).
 * - secondaryMountain:   Secondary mountain of influence (optional).
 * - purposeBootcampCompleted: Whether user completed purpose bootcamp (boolean).
 * - discipleshipCompleted:    Whether user completed discipleship (boolean).
 * - hasVoterCard:        Whether user has a voter card (boolean).
 * - hasPassport:         Whether user has a passport (boolean).
 * - hasDriversLicense:   Whether user has a driver's license (boolean).
 * - role:                User's role in the system (enum, default: 'soldier').
 * - password:            Hashed password (required).
 * - createdAt:           Timestamp for when the user was created (defaults to now).
 */
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true }, // User's first name
  lastName: { type: String, required: true }, // User's last name
  email: { type: String, required: true }, // User's email address
  phone: { type: String }, // Optional phone number
  sex: { type: String, enum: ['Male', 'Female'] }, // Gender
  ageBracket: {
    type: String,
    enum: ['18-25', '26-35', '36-45', '46-60', '60+'],
  }, // Age group
  dateOfBirth: Date, // Optional date of birth

  battalion: {
    type: String,
    enum: ['Alpha', 'Bravo', 'Charlie', 'Delta'],
  }, // Battalion assignment
  lhbCode: String, // Unique code for the user

  relationshipStatus: {
    type: String,
    enum: ['Single', 'Engaged', 'Married'],
  }, // Marital status
  weddingAnniversary: Date, // Optional wedding anniversary

  address: String, // Optional address
  country: String, // Optional country

  personalityType: String, // Optional personality type
  fiveFoldGift: {
    type: String,
    enum: ['Apostle', 'Pastor', 'Evangelist', 'Teacher', 'Prophet'],
  }, // Spiritual gift
  leadershipRoles: [String], // Array of leadership roles

  education: {
    type: String,
    enum: ['SSCE', 'OND', 'HND', 'Bachelors', 'Masters', 'PhD'],
  }, // Education level
  jobStatus: {
    type: String,
    enum: ['Employed', 'Self Employed', 'Contract', 'Unemployed'],
  }, // Employment status
  incomeRange: { type: String }, // Optional income range

  purposeStatus: {
    type: String,
    enum: ['Discovered', 'Not Yet Discovered', 'In Progress'],
  }, // Purpose discovery status
  primaryMountain: String, // Primary mountain of influence
  secondaryMountain: String, // Secondary mountain of influence

  purposeBootcampCompleted: Boolean, // Purpose bootcamp completion status
  discipleshipCompleted: Boolean, // Discipleship completion status

  hasVoterCard: Boolean, // Whether user has a voter card
  hasPassport: Boolean, // Whether user has a passport
  hasDriversLicense: Boolean, // Whether user has a driver's license

  role: {
    type: String,
    enum: ['commander', 'commando', 'special_force', 'soldier'],
    default: 'soldier',
  }, // User's role in the system

  password: { type: String, required: true }, // Hashed password
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

module.exports = mongoose.model('User', userSchema); // Export the User model for use in other parts of the application
