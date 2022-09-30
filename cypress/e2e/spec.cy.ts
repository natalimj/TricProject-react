describe('Test1', () => {
  it('Join', () => {
    cy.visit("https://jolly-forest-02e0b3603-8.westeurope.1.azurestaticapps.net");
    cy.get('[data-cy="join"]').click();
    cy.get('[data-testid="create"]').should('be.visible');
    cy.get('[data-testid="username"]').type("trashpanda");
    cy.get('[data-cy="create"]').click();
    cy.get('[data-testid="spinner"]').should('be.visible');
  })
})

export {}