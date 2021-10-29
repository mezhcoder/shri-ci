import React from 'react';
import { cn } from '@bem-react/classname';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../store';

export interface CartBadgeProps {
    id: number;
}

const bem = cn('CartBadge');

export const CartBadge: React.FC<CartBadgeProps> = ({ id }) => {
    const cart = useSelector((s: ApplicationState) => s.cart);

    return cart[id] ? <span className={bem(null, ['text-success', 'mx-3'])}>Item in cart</span> : null;
}
