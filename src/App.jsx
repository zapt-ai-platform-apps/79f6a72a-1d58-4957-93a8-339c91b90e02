import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { SolidMarkdown } from 'solid-markdown';

function App() {
  const [jokes, setJokes] = createSignal([]);
  const [newJoke, setNewJoke] = createSignal({ setup: '', punchline: '' });
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [generatedImage, setGeneratedImage] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const [markdownText, setMarkdownText] = createSignal('');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchJokes = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/getJokes', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setJokes(data);
    } else {
      console.error('Error fetching jokes:', response.statusText);
    }
  };

  const saveJoke = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/saveJoke', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJoke()),
      });
      if (response.ok) {
        setJokes([...jokes(), newJoke()]);
        setNewJoke({ setup: '', punchline: '' });
      } else {
        console.error('Error saving joke');
      }
    } catch (error) {
      console.error('Error saving joke:', error);
    }
  };

  createEffect(() => {
    if (!user()) return;
    fetchJokes();
  });

  const handleGenerateJoke = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Give me a joke in JSON format with the following structure: { "setup": "joke setup", "punchline": "joke punchline" }',
        response_type: 'json'
      });
      setNewJoke(result);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const result = await createEvent('generate_image', {
        prompt: 'A funny cartoon character telling a joke'
      });
      setGeneratedImage(result);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    setLoading(true);
    try {
      const result = await createEvent('text_to_speech', {
        text: `${newJoke().setup} ... ${newJoke().punchline}`
      });
      setAudioUrl(result);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkdownGeneration = async () => {
    setLoading(true);
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: 'Write a short, funny story about a comedian in markdown format',
        response_type: 'text'
      });
      setMarkdownText(result);
    } catch (error) {
      console.error('Error generating markdown:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="h-full bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center h-full">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-6xl mx-auto">
          <header class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">New App - Joke Central</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </header>

          <main>
            <h2 class="sr-only">Main Content</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <section class="col-span-1 md:col-span-2 lg:col-span-1">
                <h2 class="text-2xl font-bold mb-4 text-purple-600">Add New Joke</h2>
                <form onSubmit={saveJoke} class="space-y-4" aria-label="Add new joke">
                  <input
                    type="text"
                    placeholder="Setup"
                    value={newJoke().setup}
                    onInput={(e) => setNewJoke({ ...newJoke(), setup: e.target.value })}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    required
                    aria-label="Joke setup"
                  />
                  <input
                    type="text"
                    placeholder="Punchline"
                    value={newJoke().punchline}
                    onInput={(e) => setNewJoke({ ...newJoke(), punchline: e.target.value })}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                    required
                    aria-label="Joke punchline"
                  />
                  <div class="flex space-x-4">
                    <button
                      type="submit"
                      class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      aria-label="Save joke"
                    >
                      Save Joke
                    </button>
                    <button
                      type="button"
                      class={`flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleGenerateJoke}
                      disabled={loading()}
                      aria-label="Generate joke"
                    >
                      <Show when={loading() && !generatedImage() && !audioUrl() && !markdownText()}>
                        Generating...
                      </Show>
                      <Show when={!loading()}>
                        Generate Joke
                      </Show>
                    </button>
                  </div>
                </form>
              </section>

              <section class="col-span-1 md:col-span-2 lg:col-span-1">
                <h2 class="text-2xl font-bold mb-4 text-purple-600">Joke List</h2>
                <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4" role="list" aria-label="Joke list">
                  <For each={jokes()}>
                    {(joke) => (
                      <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105" role="listitem">
                        <p class="font-semibold text-lg text-purple-600 mb-2">{joke.setup}</p>
                        <p class="text-gray-700">{joke.punchline}</p>
                      </div>
                    )}
                  </For>
                </div>
              </section>

              <section class="col-span-1 md:col-span-2 lg:col-span-1">
                <h2 class="text-2xl font-bold mb-4 text-purple-600">Additional Features</h2>
                <div class="space-y-4">
                  <button
                    onClick={handleGenerateImage}
                    class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading()}
                    aria-label="Generate image"
                  >
                    <Show when={loading() && generatedImage()}>
                      Generating...
                    </Show>
                    <Show when={!loading()}>
                      Generate Image
                    </Show>
                  </button>
                  <Show when={newJoke().setup && newJoke().punchline}>
                    <button
                      onClick={handleTextToSpeech}
                      class={`w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading()}
                      aria-label="Text to speech"
                    >
                      <Show when={loading() && audioUrl()}>
                        Converting...
                      </Show>
                      <Show when={!loading()}>
                        Text to Speech
                      </Show>
                    </button>
                  </Show>
                  <button
                    onClick={handleMarkdownGeneration}
                    class={`w-full px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading()}
                    aria-label="Generate markdown story"
                  >
                    <Show when={loading() && markdownText()}>
                      Generating...
                    </Show>
                    <Show when={!loading()}>
                      Generate Markdown
                    </Show>
                  </button>
                </div>
              </section>
            </div>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Show when={generatedImage()}>
                <section>
                  <h3 class="text-xl font-bold mb-2 text-purple-600">Generated Image</h3>
                  <img src={generatedImage()} alt="Generated joke visual" class="w-full rounded-lg shadow-md" />
                </section>
              </Show>
              <Show when={audioUrl()}>
                <section>
                  <h3 class="text-xl font-bold mb-2 text-purple-600">Audio Joke</h3>
                  <audio controls src={audioUrl()} class="w-full" aria-label="Audio joke player" />
                </section>
              </Show>
              <Show when={markdownText()}>
                <section>
                  <h3 class="text-xl font-bold mb-2 text-purple-600">Markdown Story</h3>
                  <div class="bg-white p-4 rounded-lg shadow-md">
                    <SolidMarkdown>{markdownText()}</SolidMarkdown>
                  </div>
                </section>
              </Show>
            </div>
          </main>
        </div>
      </Show>
    </div>
  );
}

export default App;