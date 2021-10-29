import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { cn } from '@bem-react/classname';

import { ProductItem } from '../components/ProductItem';
import { ApplicationState, productsLoad } from '../store';

const bem = cn('Catalog');

export const Catalog: React.FC = () => {
    const dispatch = useDispatch();
    const products = useSelector((s: ApplicationState) => s.products);

    useEffect(() => {
        dispatch(productsLoad())
    }, []);

    const items: React.ReactNode = products ?
        products.map(p => (
            <div key={p.id} data-testid={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductItem product={p} />
            </div>
        )) :
        'LOADING';

    return (
        <div className={bem()}>
            <Helmet title="Catalog" />
            <div className="row">
                <div className="col">
                    <h1>Catalog</h1>
                </div>
            </div>
            <div className="row">
                {items}
            </div>
        </div>
    );
}
