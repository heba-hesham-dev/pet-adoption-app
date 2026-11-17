const nodemailer = require('nodemailer');

// Connects to Gmail with the App Password from .env. Used by both emails.
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendRequestEmail(request) {
  const transporter = createTransporter();

  const date = new Date(request.visitDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  await transporter.sendMail({
    from: `"Pet Adoption" <${process.env.EMAIL_USER}>`,
    to: request.email,
    subject: `We received your request to adopt ${request.petName}`,
    text: `Hi ${request.fullName},

Thank you for your request to adopt ${request.petName} (${request.petBreed}).

Your preferred visit: ${date}, ${request.visitTime}.

Our team will contact you within 24 hours to confirm your visit.

Pet Adoption Team`,
  });
}

async function sendPetPostEmail(post) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Pet Adoption" <${process.env.EMAIL_USER}>`,
    to: post.email,
    subject: `We received your post about ${post.name}`,
    text: `Hi,

Thank you for posting ${post.name} (${post.breed}, ${post.species}) for adoption.

We received your details and ${post.photos.length} photo(s). Our team will review your post and contact you within 24 hours by phone or email to arrange the next steps.

Pet Adoption Team`,
  });
}

module.exports = { sendRequestEmail, sendPetPostEmail };