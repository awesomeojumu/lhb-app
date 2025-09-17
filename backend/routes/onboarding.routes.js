const express = require('express')
const router = express.Router()
const OnboardingController = require('../controllers/onboarding.controller')
const { authenticate } = require('../middleware/auth.middleware')

/**
 * Onboarding Routes
 *
 * All routes require authentication
 */

// Save onboarding step data
router.put('/step', authenticate, OnboardingController.saveStepData)

// Get onboarding progress
router.get('/progress', authenticate, OnboardingController.getProgress)

// Complete onboarding
router.post('/complete', authenticate, OnboardingController.completeOnboarding)

// Get onboarding status
router.get('/status', authenticate, OnboardingController.getStatus)

module.exports = router
