import React from 'react';
import { Helmet } from 'react-helmet';
import { cn } from '@bem-react/classname';

const bem = cn('Home');

export const Home: React.FC = () => {
    return (
        <div className={bem()}>
            <Helmet title="Welcome" />
            <div className="row">
                <div className="col bg-secondary text-white py-4 bg-opacity-75">
                    <p className="display-3">Welcome to Example store!</p>
                    <p className="lead">
                        Culpa perspiciatis corporis facilis fugit similique
                    </p>
                    <p className="lead">
                        Cum aut ut eveniet rem cupiditate natus veritatis quia
                    </p>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-12 col-md-4 bg-light py-3">
                    <h1>Quickly</h1>
                    <p className="lead">
                        Odio aut assumenda ipsam amet reprehenderit. Perspiciatis qui molestiae qui tempora quisquam
                    </p>
                </div>
                <div className="col-12 col-md-4 bg-light py-3">
                    <h1>Qualitatively</h1>
                    <p className="lead">
                        Ut nisi distinctio est non voluptatem. Odio aut assumenda ipsam amet reprehenderit
                    </p>
                </div>
                <div className="col-12 col-md-4 bg-light py-3">
                    <h1>Inexpensive</h1>
                    <p className="lead">
                        Perspiciatis qui molestiae qui tempora quisquam. Ut nisi distinctio est non voluptatem
                    </p>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-12py-3">
                    <p>
                        Sed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa.
                        Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.
                    </p>
                    <p>
                        Modi corporis consectetur aliquid sit cum tenetur enim. Sed voluptatum quis voluptates laudantium incidunt laudantium.
                        Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed.
                        Corrupti commodi voluptatem vero soluta hic.
                    </p>
                </div>
            </div>
        </div>
    );
}