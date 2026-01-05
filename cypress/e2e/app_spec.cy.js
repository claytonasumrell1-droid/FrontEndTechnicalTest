describe('App basic', () => {
  it('loads the app and shows app-root', () => {
    cy.visit('/');
    cy.get('app-root').should('exist');
    cy.contains('h1', 'Welcome');
  });
});
