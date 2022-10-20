const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';

describe("Un participant souhaite s'inscrire à la prochaine course A Ton Allure", () => {
	beforeEach(() => {
		cy.visit(FRONTEND_URL, { failOnStatusCode: false });
	});

	it("La page d'inscription à la prochaine course s'affiche", () => {
		cy.url().should('include', '/race/next').get('h2').contains('La prochaine course a lieu le');
	});

	it('Le formulaire est disponible et affiche des champs vides', () => {
		cy.get('form')
			.should('have.attr', 'enctype', 'multipart/form-data')
			.get('input[name="runner.email"]')
			.should('be.empty')
			.get('input[name="runner.firstname"]')
			.should('be.empty')
			.get('input[name="runner.lastname"]')
			.should('be.empty');
	});

	describe('pour la première fois', () => {
		it('en courant', () => {
			cy.get('input[name="runner.email"]')
				.clear()
				.type('pablo.lenouveau@yahoo.fr')
				.get('input[name="runner.firstname"]')
				.clear()
				.type('Pablo')
				.get('input[name="runner.lastname"]')
				.clear()
				.type('Lenouveau')
				.get('input[name="files.certificate')
				.selectFile('cypress/e2e/assets/certificat_medical.pdf')
				.get('form')
				.submit()
				.get('h2')
				.contains('Merci Pablo')
				.get('p')
				.contains('Ton inscription est confirmée pour la course du');
		});

		it('en marchant', () => {
			cy.get('input[name="runner.email"]')
				.clear()
				.type('paulo.lerenouveau@yahoo.fr')
				.get('input[name="runner.firstname"]')
				.clear()
				.type('Paulo')
				.get('input[name="runner.lastname"]')
				.clear()
				.type('Lerenouveau')
				.get('input[name="run.walking"]')
				.click()
				.get('input[name="files.certificate')
				.should('not.exist')
				.get('form')
				.submit()
				.get('h2')
				.contains('Merci Paulo')
				.get('p')
				.contains('Ton inscription est confirmée pour la course du');
		});
	});

	describe("ce n'est pas sa première course", () => {
		it('en tant que simple coureur et mineur', () => {
			cy.get('input[name="runner.email"]')
				.clear()
				.type('r.mahel@yahoo.fr')
				.blur()
				.get('input[name="runner.firstname"]')
				.should('have.value', 'Réhane')
				.get('input[name="runner.lastname"]')
				.should('have.value', 'Mahel')
				.get('input[name="files.certificate')
				.selectFile('cypress/e2e/assets/certificat_medical.pdf')
				.get('input[name="files.authorization')
				.selectFile('cypress/e2e/assets/autorisation_parentale.jpg')
				.get('form')
				.submit()
				.get('h2')
				.contains('Merci Réhane')
				.get('p')
				.contains('Ton inscription est confirmée pour la course du');
		});

		it.skip('en tant que "parent" marcheur d\'autres coureurs', () => {
			cy.get('input[name="runner.email"]')
				.clear()
				.type('marie.revelle@gmail.com')
				.blur()
				.get('select[name="runnerId"]')
				.should('contain', 'Clarisse Roblin')
				.select('Marie Revelle')
				.get('input[name="run.walking"]')
				.click()
				.get('input[name="files.certificate')
				.should('not.exist')
				.get('form')
				.submit()
				.get('h2')
				.contains('Merci Marie')
				.get('p')
				.contains('Ton inscription est confirmée pour la course du');
		});
	});

	describe('Et souhaite inscrire une autre personne ensuite', () => {
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
});
