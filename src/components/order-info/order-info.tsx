import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const [orderData, setOrderData] = useState<TOrder | null>(null);

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.userOrders.orders);

  useEffect(() => {
    const orderInStore =
      feedOrders.find((o) => o.number === Number(number)) ||
      userOrders.find((o) => o.number === Number(number));

    if (orderInStore) {
      setOrderData(orderInStore);
    } else if (number) {
      getOrderByNumberApi(Number(number))
        .then((data) => {
          if (data?.orders?.length) {
            setOrderData(data.orders[0]);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [number, feedOrders, userOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
