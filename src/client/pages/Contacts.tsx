import React from 'react';
import { Helmet } from 'react-helmet';
import { cn } from '@bem-react/classname';

const bem = cn('Contacts');

export const Contacts: React.FC = () => {
    return (
        <div className={bem()}>
            <Helmet title="Contacts" />
            <div className="row">
                <div className="col">
                    <h1>Contacts</h1>

                    <p>
                        Ut non consequatur aperiam ex dolores. Voluptatum harum consequatur est totam. Aut voluptatum aliquid aut optio et ea.
                        Quaerat et eligendi minus quasi. Culpa voluptatem voluptatem dolores molestiae aut quos iure.
                        Repellat aperiam ut aliquam iure. Veritatis magnam quisquam et dolorum recusandae aut.
                    </p>
                    <p>
                        Molestias inventore illum architecto placeat molestias ipsam facilis ab quo.
                        Rem dolore cum qui est reprehenderit assumenda voluptatem nisi ipsa. Unde libero quidem. Excepturi maiores vel quia.
                        Neque facilis nobis minus veniam id. Eum cum eveniet accusantium molestias voluptas aut totam laborum aut.
                        Ea molestiae ullam et. Quis ea ipsa culpa eligendi ab sit ea error suscipit. Quia ea ut minus distinctio quam eveniet nihil.
                        Aut voluptate numquam ipsa dolorem et quas nemo.
                    </p>
                </div>
            </div>
        </div>
    );
}
