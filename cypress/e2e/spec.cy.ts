describe("home page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("the h1 contains the correct text", () => {
    cy.get("h1").contains("Piros Photography");
  });

  it("the features are correct", () => {
    cy.get('[data-testid="site-title-heading"]');
    cy.get('[data-testid="page-links"]');
  });
});
