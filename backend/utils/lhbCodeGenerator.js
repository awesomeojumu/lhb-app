const User = require('../models/User')

/**
 * Generates a unique LHB code for a user
 * Format: LHB{NUMBER} starting from 0020
 *
 * @returns {Promise<string>} - A unique LHB code
 */
const generateLhbCode = async () => {
  try {
    // Find the highest existing LHB code
    const existingCodes = await User.find({
      lhbCode: { $regex: /^LHB\d+$/ }
    }).select('lhbCode').sort({ lhbCode: -1 })

    let nextNumber = 20 // Start from 0020

    if (existingCodes.length > 0) {
      // Extract the number from the highest existing code
      const lastCode = existingCodes[0].lhbCode
      const match = lastCode.match(/^LHB(\d+)$/)
      if (match) {
        const lastNumber = parseInt(match[1], 10)
        nextNumber = lastNumber + 1
      }
    }

    // Generate the new LHB code
    const lhbCode = `LHB${nextNumber.toString().padStart(4, '0')}`

    // Double-check that the code is unique (safety check)
    const existingUser = await User.findOne({ lhbCode })
    if (existingUser) {
      // If somehow the code exists, try the next number
      return generateLhbCode()
    }

    return lhbCode
  } catch (error) {
    console.error('Error generating LHB code:', error)
    throw error
  }
}

module.exports = {
  generateLhbCode
}
