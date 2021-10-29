import React from 'react';
import { Helmet } from 'react-helmet';
import { cn } from '@bem-react/classname';

import { Image } from '../components/Image';

const bem = cn('Delivery');

export const Delivery: React.FC = () => {
    return (
        <div className={bem()}>
            <Helmet title="Delivery" />
            <div className="row">
                <div className="col">
                    <h1>Delivery</h1>
                    <p>
                        Deserunt occaecati tempora. Qui occaecati est aliquam. Enim qui nulla ipsam.
                        Incidunt impedit enim consequuntur amet at consequuntur vero.
                        Dolor et ad facere asperiores iste est praesentium quaerat iure.
                        Quibusdam mollitia autem quos voluptas quia est doloremque corporis et.
                        Sed fuga quasi esse perspiciatis fugit maxime. Qui quidem amet.
                    </p>
                    <Image className="w-25 mb-4" />
                    <p>
                        Dolores magnam consequatur iste aliquam qui sint non ab.
                        Culpa saepe omnis. Recusandae vel aperiam voluptates harum.
                        Perspiciatis qui molestiae qui tempora quisquam. Mollitia voluptatum minus laboriosam.
                        Dolor maiores possimus repudiandae praesentium hic eos. Veritatis et repellat.
                    </p>
                    <p>
                        Pariatur nisi nobis hic ut facilis sunt rerum id error. Soluta nihil quisquam quia rerum illo.
                        Ipsam et suscipit est iure incidunt quasi et eum. Culpa libero dignissimos recusandae.
                        In magni sapiente non voluptas molestias. Deserunt quos quo placeat sunt.
                        Ea necessitatibus dolores eaque ex aperiam sunt eius. Saepe aperiam aut.
                        Quaerat natus consequatur aut est id saepe et aut facilis.
                    </p>
                </div>
            </div>
        </div>
    );
}
