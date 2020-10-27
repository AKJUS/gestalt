describe('Table Accessibility check', () => {
  beforeEach(() => {
    cy.visit('/Table');
    cy.injectAxe();
  });

  it('Tests accessibility on the Table page', () => {
    cy.configureAxe({
      rules: [
        {
          id: 'color-contrast',
          enabled: false,
        },
        {
          // Disabled to avoid confusion for sticky header example
          id: 'scrollable-region-focusable',
          enabled: false,
        },
      ],
    });
    cy.checkA11y();
  });
});
