const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const connectionRequestSchema = require('../models/connectionRequest');
const sendEmail = require('./sendEmail');

cron.schedule('* 8 * * *', async () => {
  //job run at 8 am in the morning
  //send email to all people who got requests previous day
  const yesterday = subDays(new Date(), 1);
  const yesterdayStart = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);

  try {
    const pendingRequests = await connectionRequestSchema
      .find({
        status: 'interested',
        createdAt: {
          $gte: yesterdayStart,
          $lte: yesterdayEnd,
        },
      })
      .populate('fromUserId toUserId');

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log('List of emails to send cron job - ', listOfEmails);

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          'Your connection requests on DevChat!',
          'You have new connection requests on DevChat. Log in to your account to respond to them. accept or reject them.',
        );
        console.log(
          'Daily cron job email sent to - ',
          email,
          ' Status - ',
          res,
        );
      } catch (err) {}
    }
  } catch (err) {
    console.error('Error in cron job - ', err);
  }
});
