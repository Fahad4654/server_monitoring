// Required packages: express, nodemailer, systeminformation
// Install using: npm install express nodemailer systeminformation
import express from "express";
import nodemailer from "nodemailer";
import si from "systeminformation";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4444;

// Configuration
const CPU_USAGE_THRESHOLD = Number(process.env.CPU_USAGE_THRESHOLD) || 80; // Percentage
const RAM_USAGE_THRESHOLD = Number(process.env.RAM_USAGE_THRESHOLD) || 80; // Percentage
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS || ""; // Replace with your email
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || ""; // Replace with your app-specific password
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || ""; // Replace with your recipient email
const SERVER_NAME = process.env.SERVER_NAME || "localhost";


// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASSWORD,
  },
});

// Monitor function
async function monitorSystem() {
  try {
    // Get system metrics
    const cpuData = await si.currentLoad();
    const memoryData = await si.mem();

    const cpuUsage = cpuData.currentLoad; // Current CPU load percentage
    const ramUsage = (memoryData.active / memoryData.total) * 100; // RAM usage percentage

    console.log(
      `CPU Usage: ${cpuUsage.toFixed(2)}%, RAM Usage: ${ramUsage.toFixed(2)}%`
    );

    // Check if thresholds are exceeded
    if (cpuUsage > CPU_USAGE_THRESHOLD || ramUsage > RAM_USAGE_THRESHOLD) {
      const alertMessage = `Warning! System resource usage is high:\nCPU Usage: ${cpuUsage.toFixed(
        2
      )}%\nRAM Usage: ${ramUsage.toFixed(2)}%`;
      console.log(alertMessage);

      // Send email alert
      await sendEmail(
        `High System Resource Usage of ${SERVER_NAME}`,
        alertMessage
      );
    }
  } catch (error) {
    console.error("Error monitoring system:", error);
  }
}

// Function to send email
// async function sendEmail(subject: string, message: string) {
//   try {
//     const mailOptions = {
//       from: EMAIL_ADDRESS,
//       to: RECIPIENT_EMAIL,
//       subject,
//       text: message,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Alert email sent successfully");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// }

async function sendEmail(subject: string, message: string) {
  try {
    const mailOptions = {
      from: EMAIL_ADDRESS,
      to: RECIPIENT_EMAIL,
      subject,
      text: message, // Fallback for email clients that don't support HTML
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h1 style="color: red;">Alert!!</h1>
          <h2 style="color: red;">High System Resource Usage</h2>
          <p>
            <strong>CPU Usage:</strong> ${message.split('\n')[1]}<br>
            <strong>RAM Usage:</strong> ${message.split('\n')[2]}<br>
          </p>
          <p>Please take immediate action to address this issue.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Alert email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Schedule system monitoring
setInterval(monitorSystem, Number(process.env.MONITORING_INTERVAL) * 1000); // Check every 60 seconds

// Start the Express server
app.get("/", (req, res) => {
  res.send("System Monitoring Service is running!");
});


app.get('/status', async (req, res) => {
    console.log('/status')
    try {
      const cpuData = await si.currentLoad();
      const memoryData = await si.mem();
  
      const cpuUsage = cpuData.currentLoad; // Current CPU load percentage
      const ramUsage = (memoryData.active / memoryData.total) * 100; // RAM usage percentage
  
      res.json({
        server: SERVER_NAME,
        cpuUsage: `${cpuUsage.toFixed(2)}%`,
        ramUsage: `${ramUsage.toFixed(2)}%`,
        status: 'ok',
      });
    } catch (error: unknown) {
      // Type assertion to tell TypeScript that the error is an instance of Error
      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to retrieve system metrics', details: error.message });
      } else {
        // If it's not an instance of Error, return a general error
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://${SERVER_NAME}:${PORT}`);
});
