import { NavLink } from '@solidjs/router';

function BottomNavBar(props) {
  return (
    <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 text-gray-800">
      <div class="flex justify-around">
        <NavLink
          href="/"
          class="flex flex-col items-center py-2 cursor-pointer"
          activeClass="text-purple-600"
        >
          <span class="text-xl">🏠</span>
          <span>الرئيسية</span>
        </NavLink>
        <NavLink
          href="/tools"
          class="flex flex-col items-center py-2 cursor-pointer"
          activeClass="text-purple-600"
        >
          <span class="text-xl">🛠️</span>
          <span>أدوات</span>
        </NavLink>
        <NavLink
          href="/service"
          class="flex flex-col items-center py-2 cursor-pointer"
          activeClass="text-purple-600"
        >
          <span class="text-xl">💼</span>
          <span>خدمات</span>
        </NavLink>
        <button
          onClick={props.handleSignOut}
          class="flex flex-col items-center py-2 cursor-pointer text-red-500"
        >
          <span class="text-xl">🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </nav>
  );
}

export default BottomNavBar;