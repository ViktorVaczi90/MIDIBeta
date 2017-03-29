import React from 'react'
import './AboutView.scss'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';


const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: 500,
        height: 450,
        flexWrap: 'nowrap',
        overflowY: 'auto',
    },
};

const tilesData = [
    {
        img: 'viktor.jpg',
        title: 'Breakfast',
        author: 'Viktor',
    },
    {
        img: 'images/grid-list/burger-827309_640.jpg',
        title: 'Tasty burger',
        author: 'Árpi',
    },
    {
        img: 'balazs.jpg',
        title: 'Camera',
        author: 'Balázs',
    },
    {
        img: 'matejcsok.jpg',
        title: 'Morning',
        author: 'Pisti',
    }
];

const GridListExampleSimple = () => (
    <div style={styles.root}>
        <GridList
            cellHeight={180}
            style={styles.gridList}
            >
            <Subheader>Staff</Subheader>
            {tilesData.map((tile) => (
                <GridTile
                    key={tile.img}
                    title={tile.title}
                    subtitle={<span>by <b>{tile.author}</b></span>}
                    actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                    >
                    <img src={tile.img} />
                </GridTile>
            ))}
        </GridList>

    </div>
);

export default GridListExampleSimple;

