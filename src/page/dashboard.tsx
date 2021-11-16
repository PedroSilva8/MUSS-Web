import React from "react";
import { Route, Routes } from 'react-router-dom';

import Header from '@elements/Header'
import Icon from '@elements/Icon'
import TreeView from '@elements/TreeView'
import ArtistPage from "./dashboard/artist";

export interface IDashboardPageProps { }
export interface IIndexPageState { }

export default class DashboardPage extends React.Component<IDashboardPageProps, IIndexPageState> {

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
                    <TreeView>
                        <TreeView.Header title="Library">
                            <TreeView.Header.Option icon="account-music" content="Artists"/>
                            <TreeView.Header.Option icon="album" content="Album"/>
                        </TreeView.Header>
                        <TreeView.Header title="Settings">
                            <TreeView.Header.Option icon="account" content="Users"/>
                            <TreeView.Header.Option icon="cog-outline" content="General"/>
                        </TreeView.Header>
                    </TreeView>
                    <Routes>
                        { /* TODO: Find out why regex nor string[] is workign on paths */ }
                        <Route path={"/"} element={<ArtistPage />}/>
                        <Route path={"/artist/*"} element={<ArtistPage />}/>
                    </Routes>
                </div>
            </>
        );
    }
}