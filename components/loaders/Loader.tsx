import React from 'react';
import classes from './Loader.module.css';

const loader = () => <span aria-hidden className={classes.loader}></span>;

export const Loader = React.memo(loader);
