import { useEffect, useState } from 'react';
import { subscribe } from '@openfin/search-api';
import { create, } from 'openfin-notifications';

// Needed to fix "no-undef" linter error
/* global fin */
const actionHi = "hi";
const actionYo = "yo";
const browserUUID = "openfin-browser";
const topics = {
    All: "all", // Search topic for the aggregated search view in Home.
    Apps: "apps", // Search topic for the `Launch` view in Home.
    Workspaces: "workspaces" // Search topic for the `Workspaces` view in Home.
}

function SearchProvider() {
    const [currentQuery, setCurrentQuery] = useState("");
    useEffect(() => {
        async function handleSearch({ query }) {
            // This could make a fetch call to a backend or rest endpoint...
            if (!query.startsWith('/sayhi')) {
                return [];
            }
            const lowercaseQuery = query.toLowerCase();
            setCurrentQuery(query);
            const name = lowercaseQuery.replace("/sayhi", '');
            return [{
                appId: "exampleApp",
                key: "UniqueKey",
                icon: "http://localhost:3000/client/favicon.ico",
                name: "Launcher",
                sayHiTo: name,
                version: "1.0",
                template: "List",
                templateContent: [["Greet Who", name], ["Greating type", "Hi"]],
                title: `Say Hi!`,
                description: "Type a URL to launch in a browser.",
                actions: [actionHi]
            },
            {
                appId: "exampleApp",
                key: "UniqueKey2",
                icon: "http://localhost:3000/client/favicon.ico",
                name: "Launcher",
                sayHiTo: name,
                version: "1.0",
                template: "List",
                templateContent: [["Greet Who", name], ["Greating type", "Yo"]],
                title: `Say Yo!`,
                description: "Type a URL to launch in a browser.",
                actions: [actionYo]
            }]
        }

        async function handleResultDispatch(result) {
            if (result.action === actionHi) {
                try {
                    create({
                        title: 'Saying Hi',
                        body: `Hi ${JSON.stringify(result.sayHiTo)}!`,
                        category: 'Event',
                        buttons: [
                            {
                                title: 'Back at ya!'
                            }
                        ]
                    });
                } catch (error) {
                    console.error(error);
                }
                console.log("Done");
            } else {
                try {
                    create({
                        title: 'Saying Yo',
                        body: `Yo ${JSON.stringify(result.sayHiTo)}!`,
                        category: 'Event',
                        buttons: [
                            {
                                title: 'Back at ya!'
                            }
                        ]
                    });
                } catch (error) {
                    console.error(error);
                }
                console.log("Done");
            }
        }

        const provider = {
            name: "my-search-provider",
            topic: "My Search Provider",

            // Called when a search is executed in Home. Can return search results.
            onSearch: handleSearch,

            // Called when the search result is clicked in Home.
            onResultDispatch: handleResultDispatch
        };

        var searchTopic = undefined;
        async function init() {
            searchTopic = await subscribe({ topic: topics.All, uuid: browserUUID });
            searchTopic.register(provider);
        }

        init();
        return () => {
            if (searchTopic) {
                searchTopic.deregister(provider);
                searchTopic.disconnect();
            }
        }
    }, []);

    return <div className="Query-Data">{currentQuery}</div>;
}

export default SearchProvider