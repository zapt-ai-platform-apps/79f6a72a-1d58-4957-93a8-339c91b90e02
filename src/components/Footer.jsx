import { Show } from 'solid-js';

function Footer(props) {
  return (
    <Show when={props.user() && props.user().email === 'daoudi.abdennour@gmail.com'}>
      <footer class="text-center py-2">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline cursor-pointer">
          Made on ZAPT
        </a>
      </footer>
    </Show>
  );
}

export default Footer;