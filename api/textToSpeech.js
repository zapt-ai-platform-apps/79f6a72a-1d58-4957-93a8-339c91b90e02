import * as Sentry from '@sentry/node';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID,
    },
  },
});

// Configure AWS Polly
const polly = new AWS.Polly({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: 'Zeina', // Arabic female voice
    };

    const data = await polly.synthesizeSpeech(params).promise();

    const tempFileName = `${uuidv4()}.mp3`;
    const filePath = path.join('/tmp', tempFileName);

    fs.writeFileSync(filePath, data.AudioStream);

    // You need to upload the file to a storage bucket or serve it from your server
    // For simplicity, we'll assume you have a method to get a publicly accessible URL
    const audioUrl = `https://your-website.com/audio/${tempFileName}`;

    // Implement the logic to make the audio file accessible at audioUrl

    res.status(200).json({ audioUrl });
  } catch (error) {
    console.error('Error in textToSpeech:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error converting text to speech' });
  }
}