import React from 'react';
import { cn } from '../../utils/cn.jsx';

export function Container({ className, children, width = '7xl', padded = true, ...props }) {
  const widthClass = `max-w-${width}`;
  return (
    <div className={cn('mx-auto w-full', widthClass, padded && 'px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  );
}

export default Container;
