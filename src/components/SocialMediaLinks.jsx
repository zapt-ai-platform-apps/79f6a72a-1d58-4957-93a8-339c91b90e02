import { For } from 'solid-js';

function SocialMediaLinks() {
  const socialMedia = [
    {
      name: 'فيسبوك',
      url: 'https://www.facebook.com/profile.php?id=61550796732035&mibextid=ZbWKwL',
      iconAlt: 'فيسبوك',
      imageRequest: 'Facebook logo icon',
    },
    {
      name: 'يوتيوب',
      url: 'YOUTUBE_URL',
      iconAlt: 'يوتيوب',
      imageRequest: 'YouTube logo icon',
    },
    {
      name: 'تيليجرام',
      url: 'https://t.me/Blindaccessibilitybot',
      iconAlt: 'تيليجرام',
      imageRequest: 'Telegram logo icon',
    },
    {
      name: 'واتساب',
      url: 'https://chat.whatsapp.com/CVW8aHib2SKIXlTroXMxYH',
      iconAlt: 'واتساب',
      imageRequest: 'WhatsApp logo icon',
    },
  ];

  return (
    <div class="mt-8 text-center">
      <h2 class="text-2xl font-bold text-primary mb-4">تابعونا على شبكات التواصل الاجتماعي</h2>
      <div class="flex justify-center space-x-reverse space-x-6">
        <For each={socialMedia}>
          {(item) => (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              class="cursor-pointer transform hover:scale-110 transition duration-300 ease-in-out"
            >
              <img
                src="PLACEHOLDER"
                alt={item.iconAlt}
                class="w-12 h-12"
                data-image-request={item.imageRequest}
              />
            </a>
          )}
        </For>
      </div>
    </div>
  );
}

export default SocialMediaLinks;