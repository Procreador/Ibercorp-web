
async function check() {
  const agents = [
    'agent_1201kkwhq8y3f799ct788xbmbt7d', // IBERCORP_COMERCIAL
    'agent_1701kez3aj70f2nas4vaagr5s9sq'  // Agente Inmobiliario
  ];
  
  for (const id of agents) {
    try {
      const resp = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${id}`, {
        headers: { "xi-api-key": "sk_68c5f042b73d84e27303c3be2a3eaf84711ea0a947e5912d" }
      });
      const data = await resp.json();
      console.log(`Agent ${id} (${data.name}):`);
      console.log(JSON.stringify(data.conversation_config?.knowledge_base, null, 2));
    } catch (e) {
      console.error(`Error checking ${id}: ${e.message}`);
    }
  }
}
check();
