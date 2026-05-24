import fs from 'fs';
import path from 'path';

describe('Polish Pass 3 Visual Revisions', () => {
  const pagePath = path.resolve(__dirname, '../app/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf8');

  test('should have the primary CTA section with correct links and copy', () => {
    expect(pageContent).toContain('Want this methodology on your own audits?');
    expect(pageContent).toContain('https://agentnoah.dev');
    expect(pageContent).toContain('https://agentnoah.dev/blog/guided-build-flash35-evidence');
    expect(pageContent).toContain('Free 14-day trial');
  });

  test('should have the rewritten hero subhead in plain English', () => {
    expect(pageContent).toContain('Most AI cost calculators show $X per million tokens.');
    expect(pageContent).toContain('The cost gaps will surprise you.');
  });

  test('should have the narrative section renamed to Quick example:', () => {
    expect(pageContent).toContain('Quick example:');
  });
});
