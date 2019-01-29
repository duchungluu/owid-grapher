import * as React from 'react'
import { observable, computed, autorun, action, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import * as algoliasearch from 'algoliasearch'
import { ALGOLIA_ID, ALGOLIA_SEARCH_KEY } from 'settings'
import { SearchResults } from './SearchResults'
import { SiteSearchResults, PostHit, ChartHit, siteSearch } from 'site/siteSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Results {
    posts: PostHit[]
    charts: ChartHit[]
}

class HeaderSearchResults extends React.Component<{ results: SiteSearchResults }> {
    componentDidMount() {
        document.body.style.overflowY = 'hidden'
    }

    componentWillUnmount() {
        document.body.style.overflowY = null
    }    

    render() {
        return <SearchResults results={this.props.results}/>
    }
}

@observer
export class HeaderSearch extends React.Component {
    @observable.ref results?: Results
    lastQuery?: string

    async runSearch(query: string) {
        const results = await siteSearch(query)

        if (this.lastQuery !== query) {
            // Don't need this result anymore
            return
        }

        runInAction(() => this.results = results)
    }

    @action.bound onSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value
        this.lastQuery = value
        if (value) {
            this.runSearch(value)
        } else {
            this.results = undefined
        }
    }

    render() {
        const {results} = this
        return <form action="/search" method="GET" className="HeaderSearch">
            <input type="search" name="q" onChange={e => this.onSearch(e)} placeholder="Search..."/>
            <div className="icon">
                <FontAwesomeIcon icon={faSearch} />
            </div>
            {results && <HeaderSearchResults results={results}/>}
        </form>
    }
}