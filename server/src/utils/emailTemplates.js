// Email template functions for adoption-related notifications

/**
 * Generate confirmation email text for new adoption request
 * @param {string} userName - Name of the user who submitted the request
 * @param {string} petName - Name of the pet being requested
 * @param {string} userMessage - Optional message from the user with their request
 * @returns {string} Formatted email body text
 */
function getAdoptionRequestConfirmation(userName, petName, userMessage) {
  let emailBody = `Hello ${userName},

Thank you for submitting an adoption request for ${petName}! We're excited that you're interested in giving this wonderful pet a loving home.

`;

  if (userMessage) {
    emailBody += `Your Message:
"${userMessage}"

`;
  }

  emailBody += `What Happens Next:
Our team will review your application carefully and get back to you within 3-5 business days. We appreciate your patience!

If you have any questions in the meantime, feel free to reach out.

Best regards,
Pet Adoption Team
`;

  return emailBody;
}

/**
 * Generate approval email for adoption request
 * @param {string} userName - Name of the user
 * @param {string} petName - Name of the pet
 * @returns {string} Formatted email body text
 */
function getAdoptionApprovalEmail(userName, petName) {
  return `Hello ${userName},

Great news! Your adoption request for ${petName} has been APPROVED! 🎉

Congratulations on your new family member. Our team will be in touch with the next steps and any additional information you may need.

We're so grateful you've chosen to adopt and give ${petName} a loving home.

Best regards,
Pet Adoption Team
`;
}

/**
 * Generate rejection email for adoption request
 * @param {string} userName - Name of the user
 * @param {string} petName - Name of the pet
 * @returns {string} Formatted email body text
 */
function getAdoptionRejectionEmail(userName, petName) {
  return `Hello ${userName},

Thank you for your interest in adopting ${petName}. Unfortunately, we're unable to approve your application at this time.

This doesn't reflect on you personally—sometimes our circumstances simply don't align with what's best for the pet. We encourage you to browse our other available pets and consider submitting another application.

We appreciate your understanding and your interest in pet adoption!

Best regards,
Pet Adoption Team
`;
}

module.exports = {
  getAdoptionRequestConfirmation,
  getAdoptionApprovalEmail,
  getAdoptionRejectionEmail,
};
