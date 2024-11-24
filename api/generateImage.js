import { Configuration, OpenAIApi } from 'openai';
import * as Sentry from '@sentry/node';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt, n = 1, size = '512x512' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
      prompt: prompt,
      n: n,
      size: size,
    });

    const imageUrl = response.data.data[0].url;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error in generateImage:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error generating image' });
  }
}