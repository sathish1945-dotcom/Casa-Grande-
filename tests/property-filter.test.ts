import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProjects, sortProjects } from '../src/lib/filter-utils';
import { PROPERTIES } from '../src/lib/data/properties';

test('filterProjects filters by City accurately', () => {
  const chennaiProjects = filterProjects(PROPERTIES, { city: 'Chennai' });
  assert.ok(chennaiProjects.length >= 3);
  assert.ok(chennaiProjects.every((p) => p.city === 'Chennai'));

  const cbeProjects = filterProjects(PROPERTIES, { city: 'Coimbatore' });
  assert.ok(cbeProjects.length >= 1);
  assert.ok(cbeProjects.every((p) => p.city === 'Coimbatore'));
});

test('filterProjects filters by BHK configuration', () => {
  const fourBhkProjects = filterProjects(PROPERTIES, { bhk: 4 });
  assert.ok(fourBhkProjects.length > 0);
  assert.ok(
    fourBhkProjects.every((p) => p.configurations.some((c) => c.bhk === 4)),
    'Every returned project should have at least one 4 BHK configuration'
  );
});

test('filterProjects filters by Budget bounds', () => {
  // Max budget ₹1 Crore (10000000)
  const affordable = filterProjects(PROPERTIES, { maxBudget: 10000000 });
  assert.ok(affordable.length > 0);
  assert.ok(affordable.every((p) => p.startingPrice <= 10000000));
});

test('filterProjects filters by Status', () => {
  const ready = filterProjects(PROPERTIES, { status: 'Ready to Move' });
  assert.ok(ready.length >= 2);
  assert.ok(ready.every((p) => p.status === 'Ready to Move'));
});

test('sortProjects sorts by price ascending and descending', () => {
  const asc = sortProjects(PROPERTIES, 'price-asc');
  assert.ok(asc[0].startingPrice <= asc[asc.length - 1].startingPrice);

  const desc = sortProjects(PROPERTIES, 'price-desc');
  assert.ok(desc[0].startingPrice >= desc[desc.length - 1].startingPrice);
});
