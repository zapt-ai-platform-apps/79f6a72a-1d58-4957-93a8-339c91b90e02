import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    const { imageData } = req.body;

    if (!imageData) {
      res.status(400).json({ error: 'No image data provided' });
      return;
    }

    // Decode base64 image
    const buffer = Buffer.from(imageData, 'base64');

    // Call the external Image Description API
    const response = await fetch(`${process.env.IMAGE_API_ENDPOINT}?language=ar&descriptionExclude=Color,Tags`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.IMAGE_API_KEY,
        'Content-Type': 'application/octet-stream'
      },
      body: buffer
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error from Image API:', errorData);
      Sentry.captureException(new Error(`Image API Error: ${errorData}`));
      res.status(500).json({ error: 'Error from Image API' });
      return;
    }

    const data = await response.json();
    const description = data.description?.captions[0]?.text || 'لا يوجد وصف متاح للصورة.';

    res.status(200).json({ description });
  } catch (error) {
    console.error('Error describing image:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}