// components/LoadingBar.js
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import LoadingBar from 'react-top-loading-bar';

const LoadingBarComponent = () => {
  const ref = useRef(null);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    if (loading) {
      ref.current.continuousStart();
    } else {
      ref.current.complete();
    }

    console.log('loading',loading)
  }, [loading]);

  return <LoadingBar color='var(--chakra-colors-brand-500)' ref={ref} />;
};

export default LoadingBarComponent;