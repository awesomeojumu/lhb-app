const User = require('../models/User')
const { asyncHandler } = require('../utils/errors')

/**
 * Onboarding Controller
 *
 * Handles user onboarding data management
 */
class OnboardingController {
  /**
   * Save onboarding step data
   * PUT /api/onboarding/step
   */
  static saveStepData = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id
      const stepData = req.body

      // Validate required fields
      if (!stepData || Object.keys(stepData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No data provided to save'
        })
      }

      // Update user with step data
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...stepData,
          updatedAt: new Date()
        },
        {
          new: true,
          runValidators: true
        }
      )

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Step data saved successfully',
        data: {
          userId: updatedUser._id,
          updatedFields: Object.keys(stepData),
          lastUpdated: updatedUser.updatedAt
        }
      })
    } catch (error) {
      console.error('Error saving step data:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to save step data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      })
    }
  })

  /**
   * Get onboarding progress
   * GET /api/onboarding/progress
   */
  static getProgress = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id
      const user = await User.findById(userId).select('-password')

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Calculate completion percentage for each section
      const progress = {
        personalInfo: calculatePersonalInfoProgress(user),
        spiritualInfo: calculateSpiritualInfoProgress(user),
        professionalInfo: calculateProfessionalInfoProgress(user),
        purposeInfo: calculatePurposeInfoProgress(user),
        documents: calculateDocumentsProgress(user),
        overall: 0
      }

      // Calculate overall progress
      const sectionProgresses = Object.values(progress).filter(val => typeof val === 'number')
      progress.overall = Math.round(sectionProgresses.reduce((sum, val) => sum + val, 0) / sectionProgresses.length)

      res.status(200).json({
        success: true,
        data: {
          progress,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            battalion: user.battalion,
            lhbCode: user.lhbCode
          },
          lastUpdated: user.updatedAt
        }
      })
    } catch (error) {
      console.error('Error getting onboarding progress:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get onboarding progress',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      })
    }
  })

  /**
   * Complete onboarding
   * POST /api/onboarding/complete
   */
  static completeOnboarding = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id
      const finalData = req.body

      // Update user with final onboarding data
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...finalData,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
          updatedAt: new Date()
        },
        {
          new: true,
          runValidators: true
        }
      )

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      // Calculate final progress
      const progress = {
        personalInfo: calculatePersonalInfoProgress(updatedUser),
        spiritualInfo: calculateSpiritualInfoProgress(updatedUser),
        professionalInfo: calculateProfessionalInfoProgress(updatedUser),
        purposeInfo: calculatePurposeInfoProgress(updatedUser),
        documents: calculateDocumentsProgress(updatedUser),
        overall: 0
      }

      const sectionProgresses = Object.values(progress).filter(val => typeof val === 'number')
      progress.overall = Math.round(sectionProgresses.reduce((sum, val) => sum + val, 0) / sectionProgresses.length)

      res.status(200).json({
        success: true,
        message: 'Onboarding completed successfully',
        data: {
          user: {
            id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            battalion: updatedUser.battalion,
            lhbCode: updatedUser.lhbCode,
            onboardingCompleted: updatedUser.onboardingCompleted,
            onboardingCompletedAt: updatedUser.onboardingCompletedAt
          },
          progress,
          completedAt: updatedUser.onboardingCompletedAt
        }
      })
    } catch (error) {
      console.error('Error completing onboarding:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to complete onboarding',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      })
    }
  })

  /**
   * Get onboarding status
   * GET /api/onboarding/status
   */
  static getStatus = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id
      const user = await User.findById(userId).select('onboardingCompleted onboardingCompletedAt firstName lastName email')

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      res.status(200).json({
        success: true,
        data: {
          isCompleted: user.onboardingCompleted || false,
          completedAt: user.onboardingCompletedAt,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        }
      })
    } catch (error) {
      console.error('Error getting onboarding status:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get onboarding status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      })
    }
  })
}

// Helper functions to calculate progress for each section
function calculatePersonalInfoProgress (user) {
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'sex', 'ageBracket', 'battalion']
  const completedFields = requiredFields.filter(field => user[field] && user[field] !== '')
  return Math.round((completedFields.length / requiredFields.length) * 100)
}

function calculateSpiritualInfoProgress (user) {
  const requiredFields = ['fiveFoldGift']
  const optionalFields = ['personalityType', 'leadershipRoles']

  const completedRequired = requiredFields.filter(field => user[field] && user[field] !== '')
  const completedOptional = optionalFields.filter(field => {
    if (field === 'leadershipRoles') {
      return user[field] && Array.isArray(user[field]) && user[field].length > 0
    }
    return user[field] && user[field] !== ''
  })

  const requiredScore = (completedRequired.length / requiredFields.length) * 70
  const optionalScore = (completedOptional.length / optionalFields.length) * 30

  return Math.round(requiredScore + optionalScore)
}

function calculateProfessionalInfoProgress (user) {
  const fields = ['education', 'jobStatus']
  const completedFields = fields.filter(field => user[field] && user[field] !== '')
  return Math.round((completedFields.length / fields.length) * 100)
}

function calculatePurposeInfoProgress (user) {
  const requiredFields = ['purposeStatus']
  const optionalFields = ['primaryMountain', 'secondaryMountain', 'purposeBootcampCompleted', 'discipleshipCompleted']

  const completedRequired = requiredFields.filter(field => user[field] && user[field] !== '')
  const completedOptional = optionalFields.filter(field => user[field] !== undefined && user[field] !== null)

  const requiredScore = (completedRequired.length / requiredFields.length) * 60
  const optionalScore = (completedOptional.length / optionalFields.length) * 40

  return Math.round(requiredScore + optionalScore)
}

function calculateDocumentsProgress (user) {
  const fields = ['hasVoterCard', 'hasPassport', 'hasDriversLicense']
  const completedFields = fields.filter(field => user[field] === true)
  return Math.round((completedFields.length / fields.length) * 100)
}

module.exports = OnboardingController
