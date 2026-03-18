import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const { constructorItems } = useSelector(
      (state) => state.burgerConstructor
    );

    const count =
      ingredient.type === 'bun'
        ? constructorItems.bun?._id === ingredient._id
          ? 2
          : 0
        : constructorItems.ingredients.filter(
            (item) => item._id === ingredient._id
          ).length;

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count} // Передаем честный ноль, если ингредиента нет
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);