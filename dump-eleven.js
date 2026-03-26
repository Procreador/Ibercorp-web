
async function check() {
  const id = 'agent_1201kkwhq8y3f799ct788xbmbt7d';
  try {
    const resp = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${id}`, {
      headers: { "xi-api-key": "sk_68c5f042b73d84e27303c3be2a3eaf84711ea0a947e5912d" }
    });
    const data = await resp.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
check();
