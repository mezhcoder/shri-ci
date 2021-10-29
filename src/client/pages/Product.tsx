import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { cn } from '@bem-react/classname';

import { ProductDetails } from '../components/ProductDetails';
import { ApplicationState, productDetailsLoad } from '../store';

export interface ProductRouteParams {
    id: string;
}

const bem = cn('Product');

export const Product: React.FC = () => {
    const dispatch = useDispatch();
    const params = useParams<ProductRouteParams>();
    const id = Number(params.id);

    useEffect(() => {
        dispatch(productDetailsLoad(id));
    }, []);

    const product = useSelector((s: ApplicationState) => s.details[id]);

    const content: React.ReactNode = product ?
        <ProductDetails product={product}/> :
        'LOADING';

    return <div className={bem()}><Helmet title={product?.name} />{content}</div>;
}