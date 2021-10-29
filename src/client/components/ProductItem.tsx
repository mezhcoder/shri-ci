import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@bem-react/classname';

import { ProductShortInfo } from '../../common/types';
import { CartBadge } from './CartBadge';
import { Image } from './Image';

const bem = cn('ProductItem');

export interface ProductItemProps {
    product: ProductShortInfo;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    return (
        <div data-testid={product.id} className={bem(null, ['card', 'w-100', 'mb-4'])}>
            <Image className="card-img-top" />
            <div className="card-body">
                <h5 className={bem('Name', ['card-title'])}>{product.name}</h5>
                <p className={bem('Price', ['card-text'])}>
                    ${product.price}
                </p>
                <Link to={`/catalog/${product.id}`} className={bem('DetailsLink', ['card-link'])}>Details</Link>
                <CartBadge id={product.id} />
            </div>
        </div>
    );
}
