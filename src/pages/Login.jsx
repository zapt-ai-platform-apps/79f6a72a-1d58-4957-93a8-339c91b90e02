import { supabase } from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const arabicLocalization = {
  variables: {
    sign_in: {
      email_label: 'البريد الإلكتروني',
      password_label: 'كلمة المرور',
      email_input_placeholder: 'أدخل بريدك الإلكتروني',
      password_input_placeholder: 'أدخل كلمة المرور',
      button_label: 'تسجيل الدخول',
      loading_button_label: 'جاري تسجيل الدخول...',
      social_provider_text: 'أو تسجيل الدخول باستخدام',
    },
    sign_up: {
      email_label: 'البريد الإلكتروني',
      password_label: 'كلمة المرور',
      email_input_placeholder: 'أدخل بريدك الإلكتروني',
      password_input_placeholder: 'أدخل كلمة المرور',
      button_label: 'إنشاء حساب',
      loading_button_label: 'جاري إنشاء الحساب...',
      social_provider_text: 'أو التسجيل باستخدام',
    },
    forgotten_password: {
      email_label: 'البريد الإلكتروني',
      password_label: 'كلمة المرور',
      email_input_placeholder: 'أدخل بريدك الإلكتروني',
      button_label: 'إرسال رابط إعادة التعيين',
      loading_button_label: 'جاري الإرسال...',
    },
    update_password: {
      password_label: 'كلمة المرور الجديدة',
      password_input_placeholder: 'أدخل كلمة المرور الجديدة',
      button_label: 'تحديث كلمة المرور',
      loading_button_label: 'جاري التحديث...',
    },
    social: {
      provider_text: 'أو تسجيل الدخول باستخدام',
      apple: 'تسجيل الدخول باستخدام آبل',
      google: 'تسجيل الدخول باستخدام جوجل',
      facebook: 'تسجيل الدخول باستخدام فيسبوك',
    },
  },
};

function Login() {
  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">تسجيل الدخول باستخدام</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'facebook', 'apple']}
          localization={arabicLocalization}
          showLinks={false}
        />
      </div>
    </div>
  );
}

export default Login;