import React from 'react';
import classes from './Loader.module.scss';

const loader = () => <span aria-hidden className={classes.loader}></span>;

export const Loader = React.memo(loader);
