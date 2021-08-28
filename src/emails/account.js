const sgMail = require('@sendgrid/mail');

//environment variables (loaded by npm package env-cmd)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'lucescupetronel@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. SUP?`,
        // html: ''
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'lucescupetronel@gmail.com',
        subject: 'Why u heff to be mad?',
        text: `Oyyy ${name} ya dumb biche, why u cancle?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
