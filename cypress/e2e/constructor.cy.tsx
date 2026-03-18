/// <reference types="cypress" />

describe('Тестирование функционала конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  });

  describe('Тестирование модальных окон ингредиента', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000');
    });

    it('должно открываться модальное окно с описанием конкретного ингредиента', () => {
      const ingredientName = 'Краторная булка N-200i';
      cy.contains(ingredientName).click();

      cy.get('#modals').contains(ingredientName).should('exist');
    });

    it('должно закрываться по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').contains('Краторная булка N-200i').should('exist');

      cy.get('#modals button').first().click();
      cy.get('#modals').children().should('have.length', 0);
    });

    it('должно закрываться по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('#modals').contains('Краторная булка N-200i').should('exist');

      cy.get('body').click(10, 10);
      cy.get('#modals').children().should('have.length', 0);
    });
  });

  describe('Тестирование создания заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', {
        success: true,
        user: { email: 'test@test.ru', name: 'Test User' }
      });
      cy.intercept('POST', 'api/orders', {
        success: true,
        order: { number: 12345 }
      });

      cy.visit('http://localhost:4000');
      
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'mock-refresh-token');
      });
      cy.setCookie('accessToken', 'mock-access-token');

      cy.reload();
    });

    afterEach(() => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('должен собрать бургер и успешно оформить заказ', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').click();

      cy.contains('Оформить заказ').click();

      cy.get('#modals').contains('12345').should('exist');

      cy.get('#modals button').first().click();
      cy.get('#modals').children().should('have.length', 0);
    });
  });
});