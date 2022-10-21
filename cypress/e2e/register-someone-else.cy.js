const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';

describe('Un participant souhaite inscrire une autre personne ensuite', () => {
  beforeEach(() => {
		cy.visit(FRONTEND_URL, { failOnStatusCode: false });
	});

  it('qui est un petit marcheur de moins de 16 ans ', () => {
    cy.get('input[name="runner.email"]')
      .clear()
      .type('pablo.lenouveau@yahoo.fr')
      .get('input[name="files.certificate')
      .selectFile('cypress/e2e/assets/certificat_medical.pdf')
      .get('form')
      .submit()
      .get('h2')
      .contains('Merci Paulo')
      .get('[data-cy="Je souhaite inscrire d\'autres personnes..."]')
      .click()
      .get('[data-cy="En l\'inscrivant moi-même..."]')
      .click()
      .get('form')
      .get('input[name="runner.firstname"]')
      .clear()
      .type('Pepito')
      .get('input[name="runner.lastname"]')
      .clear()
      .type('Lenouveau')
      .get('input[name="run.walking"]')
      .click()
      .get('[data-cy="Il/elle est mineur-e et..."')
      .click()
      .get('input[name="runner.child"][value="true"]')
      .click()
      .get('p.alert')
      .should(
        'have.text',
        "Les mineur-e-s de moins de 16 ans doivent impérativement être accompagné-e-s d'un adulte pendant toute la course !"
      )
      .get('form')
      .submit()
      .get('h2')
      .contains('Merci Pablo')
      .get('p')
      .contains("L'inscription de Pepito est confirmée pour la course du");
  });
});