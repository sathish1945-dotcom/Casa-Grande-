import test from 'node:test';
import assert from 'node:assert/strict';
import { matchPropertiesFromQuery } from '../src/lib/ai-assistant';

test('matchPropertiesFromQuery matches "2 BHK in Chennai under 80 lakh"', () => {
  const result = matchPropertiesFromQuery('I want a 2 BHK apartment in Chennai under ₹80 lakh.');
  assert.ok(result.recommendedProjects.length > 0, 'Should find matching project');
  const topMatch = result.recommendedProjects[0];
  assert.equal(topMatch.city, 'Chennai');
  assert.ok(
    topMatch.configurations.some((c) => c.bhk === 2),
    'Should have 2 BHK configuration'
  );
  assert.ok(
    result.reply.toLowerCase().includes('aura zenith') || result.reply.toLowerCase().includes('verified project'),
    'Should cite verified project details'
  );
});

test('matchPropertiesFromQuery matches luxury villa in Coimbatore', () => {
  const result = matchPropertiesFromQuery('Looking for a luxury villa in Coimbatore');
  assert.ok(result.recommendedProjects.length > 0);
  assert.equal(result.recommendedProjects[0].city, 'Coimbatore');
  assert.equal(result.recommendedProjects[0].propertyType, 'Row Villa');
});

test('matchPropertiesFromQuery handles unmatched queries transparently without hallucinations', () => {
  const result = matchPropertiesFromQuery('Show me a 10 BHK castle in Madurai for 5000 rupees');
  assert.ok(
    result.reply.includes('do not currently have an exact verified project') ||
    result.reply.includes('never invents inventory'),
    'Should politely indicate no verified match exists'
  );
});
