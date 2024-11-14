# أدوات Blind Accessibility

## نظرة عامة

"أدوات Blind Accessibility" هو تطبيق شامل يهدف إلى تعزيز الوصول الرقمي للأشخاص المكفوفين وضعاف البصر. يوفر التطبيق مجموعة من الأدوات المتقدمة التي تستخدم تقنيات الذكاء الاصطناعي لتقديم تجربة مستخدم سلسة واحترافية، مع التركيز على سهولة الاستخدام وإمكانية الوصول.

## الميزات الرئيسية

1. **المساعد الصوتي بالذكاء الاصطناعي**: تفاعل مع المساعد الذكي باستخدام الأوامر الصوتية أو النصية، واحصل على إجابات سريعة ودقيقة معروضة بتنسيق احترافي في صفحة منفصلة.
2. **محرر النصوص الذكي**: قم بتحرير وتصحيح وتشكيل وترجمة النصوص، وسيتم عرض النتائج بتنسيق احترافي في صفحة منفصلة، مع إمكانية **نسخ، استماع، وإعادة إنشاء** النص الناتج.
3. **منشئ المحتوى بالذكاء الاصطناعي**: أنشئ محتوى نصيًا مخصصًا باستخدام الذكاء الاصطناعي عن طريق اختيار نوع المحتوى وإدخال موضوع أو فكرة، وسيتم عرض المحتوى بتنسيق احترافي في صفحة منفصلة، مع إمكانية **نسخ، استماع، وإعادة إنشاء** المحتوى.
4. **الراديو العربي مع المفضلة**: استمع إلى محطات الراديو العربية من جميع أنحاء العالم العربي، وأضف محطاتك المفضلة للوصول السريع. يمكنك التحكم في التشغيل باستخدام أزرار **المحطة السابقة** و**تشغيل/إيقاف** و**المحطة التالية**، حيث تم وضع زر المحطة السابقة قبل زر التشغيل/الإيقاف، وزر المحطة التالية بعده. **تُعرض الدول والمحطات الآن باللغة العربية.**
5. **الآلة الحاسبة المتوافقة مع قارئات الشاشة**: استخدم آلة حاسبة بسيطة ومتوافقة مع قارئات الشاشة للقيام بالعمليات الحسابية الأساسية بسهولة.

## رحلات المستخدم

### 5. استخدام الآلة الحاسبة المتوافقة مع قارئات الشاشة

1. **فتح التطبيق**: افتح التطبيق من متصفح الويب.
2. **الشاشة الرئيسية**: سترى عنوان التطبيق مع وصف مختصر.
3. **فتح الآلة الحاسبة**: اضغط على زر "**الآلة الحاسبة**" للانتقال إلى صفحة الآلة الحاسبة.
4. **استخدام الآلة الحاسبة**: ستظهر لك الآلة الحاسبة على الشاشة. يمكنك استخدام الأزرار لإدخال الأرقام والعمليات الحسابية.
   - **إدخال الأرقام**: اضغط على الأزرار من 0 إلى 9 لإدخال الأرقام.
   - **العمليات الحسابية**: استخدم أزرار العمليات مثل الجمع (+)، الطرح (-)، الضرب (×)، القسمة (÷).
   - **الفاصلة العشرية**: استخدم زر النقطة (.) لإدخال الأرقام العشرية.
   - **مسح**: اضغط على زر "**مسح**" لإعادة تعيين الآلة الحاسبة.
   - **الإجابة**: اضغط على زر "=" للحصول على النتيجة.
5. **التوافق مع قارئات الشاشة**: تم تصميم الآلة الحاسبة لتكون متوافقة مع قارئات الشاشة، مع تسميات واضحة لكل زر.
6. **العودة إلى الشاشة الرئيسية**: اضغط على زر "**🔙**" للعودة إلى الشاشة الرئيسية.

## الملاحظات

- **خدمات خارجية مستخدمة**:
  - **ZAPT AI**: لاستخدام تقنيات الذكاء الاصطناعي في المساعد الصوتي ومعالجة النصوص وإنشاء المحتوى.
  - **Speech Recognition API**: لتحويل الصوت إلى نص في المساعد الصوتي ومنشئ المحتوى.
  - **Text-to-Speech API**: لتحويل النص إلى كلام في ميزات الاستماع.
  - **Radio Browser API**: لجلب وتشغيل محطات الراديو العربية، وتُعرض الدول والمحطات باللغة العربية.
- **تخزين المفضلة**: يتم حفظ المفضلة محليًا على جهازك باستخدام `localStorage`.

## البيئة

يرجى إعداد ملف `.env` بالمعلومات التالية:

- `VITE_PUBLIC_SENTRY_DSN`: عنوان DSN الخاص بخدمة Sentry لتتبع الأخطاء.
- `VITE_PUBLIC_APP_ENV`: بيئة التطبيق (`development` أو `production`).
- `VITE_PUBLIC_APP_ID`: معرف التطبيق الخاص بخدمة ZAPT.