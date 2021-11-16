import React from "react";

import Header from '@elements/Header'
import Icon from '@elements/Icon'

export interface IIndexPageProps { }
export interface IIndexPageState { }

export default class IndexPage extends React.Component<IIndexPageProps, IIndexPageState> {

    render = () => {
        return (
            <>
                <Header>
                    <Header.Chunk id="header-chunck-left">
                        
                    </Header.Chunk>
                    <Header.Chunk id="header-chunck-center" isMaxed={true}>
                        
                    </Header.Chunk>
                    <Header.Chunk id="header-chunck-right">
                        <Icon icon="account" canHover={true}/>
                        <Icon icon="view-dashboard" canHover={true}/>
                    </Header.Chunk>
                </Header>
                <div id="content">

                </div>
            </>
        );
    }
}