// API route for sending test alerts to emails
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email || !email.includes('@')) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid email address' 
        }, 
        { status: 400 }
      );
    }

    console.log(`Sending test alert to email: ${email}`);
    
    // In a production environment, this would integrate with a cloud email service
    // Examples include AWS SES, SendGrid, Mailgun, etc.
    
    // Below is a simulation of what the cloud integration would look like
    // For actual implementation, you'd need to:
    // 1. Install the appropriate SDK (e.g., @aws-sdk/client-ses, @sendgrid/mail)
    // 2. Configure with appropriate credentials (API keys, etc.)
    // 3. Handle proper error scenarios and retries

    /*
    // Example with AWS SES (pseudocode)
    const { SendEmailCommand, SESClient } = require("@aws-sdk/client-ses");
    
    const sesClient = new SESClient({ 
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
    
    const params = {
      Source: "alerts@disaster-iq.com",
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "URGENT: DisasterIQ Test Alert",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <h1>DisasterIQ Test Alert</h1>
              <p>This is a test alert from the DisasterIQ system.</p>
              <p>In an actual emergency, this email would contain:</p>
              <ul>
                <li>Details about the disaster</li>
                <li>Location information</li>
                <li>Safety recommendations</li>
                <li>Links to resources</li>
              </ul>
              <p>Thank you for testing our alert system.</p>
            `,
            Charset: "UTF-8",
          },
        },
      },
    };
    
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    */
    
    // For demonstration, simulate an API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the alert (in production, this would go to a database)
    const alertLog = {
      id: `test-${Date.now()}`,
      email,
      timestamp: new Date().toISOString(),
      type: 'test',
      delivered: true
    };
    
    console.log('Alert sent successfully:', alertLog);
    
    return Response.json({ 
      success: true, 
      message: 'Test alert sent successfully',
      alertId: alertLog.id
    });
    
  } catch (error) {
    console.error('Error sending test alert:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to send test alert' 
      }, 
      { status: 500 }
    );
  }
} 