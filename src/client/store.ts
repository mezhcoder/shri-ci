import { createStore, applyMiddleware } from 'redux';
import { combineEpics, createEpicMiddleware, ofType, StateObservable } from 'redux-observable';
import { EMPTY, from, map, mapTo, mergeMap, mergeMapTo, Observable, tap } from 'rxjs';
import { produce } from 'immer';
import { CartState, CheckoutFormData, Product, ProductShortInfo } from '../common/types';
import { CartApi, ExampleApi } from './api';

export interface ApplicationState {
    products?: ProductShortInfo[];
    details: Record<number, Product>;
    cart: CartState;
    latestOrderId?: number;
}

export interface EpicDeps {
    api: ExampleApi;
    cart: CartApi;
}

export type ExampleEpic = (action$: Observable<Action>, store$: StateObservable<ApplicationState>, deps: EpicDeps) => Observable<Action>;

const DEFAULT_STATE: ApplicationState = { details: {}, cart: {} };

// actions
export const productsLoad = () => ({ type: 'PRODUCTS_LOAD' } as const);
export const productsLoaded = (products: ProductShortInfo[]) => ({ type: 'PRODUCTS_LOADED', products } as const);
export const productDetailsLoad = (id: number) => ({ type: 'PRODUCT_DETAILS_LOAD', id } as const);
export const productDetailsLoaded = (details: Product) => ({ type: 'PRODUCT_DETAILS_LOADED', details } as const);
export const addToCart = (product: Product) => ({ type: 'ADD_TO_CART', product } as const);
export const clearCart = () => ({ type: 'CLEAR_CART' } as const);
export const checkout = (form: CheckoutFormData, cart: CartState) => ({ type: 'CHECKOUT', form, cart } as const);
export const checkoutComplete = (orderId: number) => ({ type: 'CHECKOUT_COMPLETE', orderId } as const);

export type Action =
    ReturnType<typeof checkout> |
    ReturnType<typeof checkoutComplete> |
    ReturnType<typeof addToCart> |
    ReturnType<typeof clearCart> |
    ReturnType<typeof productsLoad> |
    ReturnType<typeof productsLoaded> |
    ReturnType<typeof productDetailsLoad> |
    ReturnType<typeof productDetailsLoaded>;

// reducer

function createRootReducer(state: Partial<ApplicationState>) {
    const defaultState = { ...DEFAULT_STATE, ...state };

    const fn = (state: ApplicationState = defaultState, action: Action): ApplicationState => produce(state, draft => {
        switch (action.type) {
            case 'PRODUCTS_LOAD':
                draft.products = undefined;
                break;
            case 'PRODUCTS_LOADED':
                draft.products = action.products;
                break;
            case 'PRODUCT_DETAILS_LOADED': {
                draft.details[action.details.id] = action.details;
                break;
            }
            case 'ADD_TO_CART':
                const { id, name, price } = action.product;

                if (!draft.cart[id]) {
                    draft.cart[id] = { name, count: 0, price };
                }

                draft.cart[id].count++;
                draft.latestOrderId = undefined;
                break
            case 'CLEAR_CART':
                draft.cart = {};
                draft.latestOrderId = undefined;
                break;
            case 'CHECKOUT_COMPLETE':
                draft.latestOrderId = action.orderId;
                draft.cart = {};
                break;
        }
    });

    return fn;
}



// epics
const productsLoadEpic: ExampleEpic = (action$, store$, { api }) => action$.pipe(
    ofType('PRODUCTS_LOAD'),
    mergeMap((a: ReturnType<typeof productsLoad>) => {
        return from(api.getProducts()).pipe(
            map(products => productsLoaded(products.data)),
        );
    }),
);

const productDetailsLoadEpic: ExampleEpic = (action$, store$, { api }) => action$.pipe(
    ofType('PRODUCT_DETAILS_LOAD'),
    mergeMap((a: ReturnType<typeof productDetailsLoad>) => {
        return from(api.getProductById(a.id)).pipe(
            map(products => productDetailsLoaded(products.data)),
        );
    }),
);

const shoppingCartEpic: ExampleEpic = (action$, store$, { cart }) => action$.pipe(
    ofType('ADD_TO_CART', 'CLEAR_CART', 'CHECKOUT_COMPLETE'),
    tap(() => cart.setState(store$.value.cart)),
    mergeMapTo(EMPTY),
);

const checkoutEpic: ExampleEpic = (action$, store$, { api }) => action$.pipe(
    ofType('CHECKOUT'),
    mergeMap(({ form, cart }: ReturnType<typeof checkout>) => {
        return from(api.checkout(form, cart)).pipe(
            map(res => checkoutComplete(res.data.id)),
        );
    }),
);

export const rootEpic = combineEpics(
    checkoutEpic,
    shoppingCartEpic,
    productsLoadEpic,
    productDetailsLoadEpic,
);

export function initStore(api: ExampleApi, cart: CartApi) {
    const rootReducer = createRootReducer({
        cart: cart.getState()
    });

    const epicMiddleware = createEpicMiddleware<Action, Action, ApplicationState, EpicDeps>({
        dependencies: { api, cart }
    });

    const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

    epicMiddleware.run(rootEpic);

    return store;
}
