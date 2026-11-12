import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_AGENT_CONFIG,
  validateAgentConfig,
  generateScriptHtml,
} from './agent-config.ts';

test('DEFAULT_AGENT_CONFIG has valid fields and targetId', () => {
  const result = validateAgentConfig(DEFAULT_AGENT_CONFIG);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
  assert.equal(DEFAULT_AGENT_CONFIG.targetId, 'agent-container');
  assert.equal(DEFAULT_AGENT_CONFIG.agentId, 'v2_agt_PIurXsZC');
  assert.equal(DEFAULT_AGENT_CONFIG.clientKey, 'ck_OO4TWPiyzqbHV6mijfzTs');
});

test('validateAgentConfig catches missing keys or unreplaced placeholder', () => {
  const badConfig = {
    ...DEFAULT_AGENT_CONFIG,
    targetId: '<PLACE_YOUR_DIV_ID_HERE>',
  };
  const result = validateAgentConfig(badConfig);
  assert.equal(result.valid, false);
  assert.equal(result.errors.length > 0, true);
});

test('generateScriptHtml produces matching script tag snippet', () => {
  const html = generateScriptHtml(DEFAULT_AGENT_CONFIG);
  assert.match(html, /src="https:\/\/agent\.d-id\.com\/v2\/index\.js"/);
  assert.match(html, /data-agent-id="v2_agt_PIurXsZC"/);
  assert.match(html, /data-client-key="ck_OO4TWPiyzqbHV6mijfzTs"/);
  assert.match(html, /data-target-id="agent-container"/);
});
