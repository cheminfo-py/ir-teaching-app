const Color = require('../color');

test('Reaction status color', () => {
  expect(Color.STATUS).toHaveLength(5);
  expect(Color.getLabel(50)).toBe('Closed');
  expect(Color.getColor(50)).toBe('rgba(206,224,227,1)');
  let form = Color.getForm(50);
  expect(form.length).toBeGreaterThan(100);
  expect(form).toMatch('<option value="50" selected>');
  expect(Color.getNextStatus(30)).toBe(40);
  expect(
    Color.getColorFromReaction({ $content: { status: [{ code: 50 }] } })
  ).toBe('rgba(206,224,227,1)');
  let statuses = [{ code: 'started' }, { code: 'finished' }];
  Color.updateStatuses(statuses);
  expect(statuses).toEqual([{ code: 10 }, { code: 20 }]);
});
