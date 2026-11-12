/**
 * Agent configuration and script attributes helper for D-ID v2 interactive agent.
 */

export interface DidAgentConfig {
  scriptSrc: string;
  mode: 'full' | 'fabio' | 'widget';
  clientKey: string;
  agentId: string;
  name: string;
  monitor: boolean;
  lightMode: boolean;
  targetId: string;
}

export const DEFAULT_AGENT_CONFIG: DidAgentConfig = {
  scriptSrc: 'https://agent.d-id.com/v2/index.js',
  mode: 'full',
  clientKey: 'ck_OO4TWPiyzqbHV6mijfzTs',
  agentId: 'v2_agt_PIurXsZC',
  name: 'did-agent',
  monitor: true,
  lightMode: false,
  targetId: 'agent-container',
};

export const PROMPT_SUGGESTIONS = [
  'Tell me about your capabilities and knowledge.',
  'How do real-time neural avatars work?',
  'Give me 3 innovative ideas for AI in customer experience.',
  'What languages can you understand and speak?',
  'Can you explain quantum computing in simple terms?',
];

/**
 * Validates agent configuration
 */
export function validateAgentConfig(config: DidAgentConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.agentId || !config.agentId.trim()) {
    errors.push('Agent ID is required');
  }
  if (!config.clientKey || !config.clientKey.trim()) {
    errors.push('Client key is required');
  }
  if (!config.targetId || !config.targetId.trim()) {
    errors.push('Target container ID is required');
  }
  if (config.targetId.includes('<') || config.targetId.includes('>')) {
    errors.push('Target container ID contains placeholder brackets');
  }
  if (!config.scriptSrc.startsWith('https://')) {
    errors.push('Script source must use HTTPS');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates the HTML embed code snippet for copy/display
 */
export function generateScriptHtml(config: DidAgentConfig = DEFAULT_AGENT_CONFIG): string {
  return `<script type="module"
  src="${config.scriptSrc}"
  data-mode="${config.mode}"
  data-client-key="${config.clientKey}"
  data-agent-id="${config.agentId}"
  data-name="${config.name}"
  data-monitor="${config.monitor}"
  data-light-mode="${config.lightMode}"
  data-target-id="${config.targetId}">
</script>`;
}
