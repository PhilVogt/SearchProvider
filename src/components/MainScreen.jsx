import React from 'react';
import SearchProvider from './SearchProvider';

function MainScreen() {
    return (
        <div>
            <h1>OpenFin Search and Notifications Example</h1>
            <p>Welcome! Load up Home to register this application as a search provider. When searches are clicked on we'll launch a message saying "hello".</p>

            <SearchProvider />
        </div >
    );
}

export default MainScreen;