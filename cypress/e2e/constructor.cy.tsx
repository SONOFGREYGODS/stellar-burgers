/// <reference types="cypress" />

const testUrl = 'http://localhost:4000';

const selectors = {
  modalsRoot: '#modals',
  modalCloseButton: '#modals button',
  ingredientAddButton: 'button',
  pageBody: 'body'
};

const textValues = {
  bunName: 'Краторная булка N-200i',
  mainName: 'Биокотлета из марсианской Магнолии',
  submitOrder: 'Оформить заказ',
  orderNumber: '12345'
};

describe('Тестирование функционала конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  });

  describe('Тестирование модальных окон ингредиента', () => {
    beforeEach(() => {
      cy.visit(testUrl);
      cy.contains(textValues.bunName).as('bunIngredient');
      cy.get(selectors.modalsRoot).as('modalsRoot');
      cy.get(selectors.modalCloseButton).first().as('modalCloseButton');
    });

    it('должно открываться модальное окно с описанием конкретного ингредиента', () => {
      cy.get('@bunIngredient').click();

      cy.get('@modalsRoot').contains(textValues.bunName).should('exist');
    });

    it('должно закрываться по клику на крестик', () => {
      cy.get('@bunIngredient').click();
      cy.get('@modalsRoot').contains(textValues.bunName).should('exist');

      cy.get('@modalCloseButton').click();
      cy.get('@modalsRoot').children().should('have.length', 0);
    });

    it('должно закрываться по клику на оверлей', () => {
      cy.get('@bunIngredient').click();
      cy.get('@modalsRoot').contains(textValues.bunName).should('exist');

      cy.get(selectors.pageBody).click(10, 10);
      cy.get('@modalsRoot').children().should('have.length', 0);
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
        order: { number: Number(textValues.orderNumber) }
      });

      cy.visit(testUrl);

      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'mock-refresh-token');
      });
      cy.setCookie('accessToken', 'mock-access-token');

      cy.reload();

      cy.contains(textValues.bunName)
        .parent()
        .find(selectors.ingredientAddButton)
        .as('bunAddButton');
      cy.contains(textValues.mainName)
        .parent()
        .find(selectors.ingredientAddButton)
        .as('mainAddButton');
      cy.contains(textValues.submitOrder).as('submitOrderButton');
      cy.get(selectors.modalsRoot).as('modalsRoot');
      cy.get(selectors.modalCloseButton).first().as('modalCloseButton');
    });

    afterEach(() => {
      cy.clearLocalStorage();
      cy.clearCookies();
    });

    it('должен собрать бургер и успешно оформить заказ', () => {
      cy.get('@bunAddButton').click();
      cy.get('@mainAddButton').click();

      cy.get('@submitOrderButton').click();

      cy.get('@modalsRoot').contains(textValues.orderNumber).should('exist');

      cy.get('@modalCloseButton').click();
      cy.get('@modalsRoot').children().should('have.length', 0);
    });
  });
});
