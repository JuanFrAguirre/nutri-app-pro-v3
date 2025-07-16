import clsx from 'clsx';
import React from 'react';

const DividedTextLine = ({
  first,
  second,
  className,
  classNameFirst,
  classNameSecond,
}: {
  first: string | number;
  second: string | number;
  className?: string;
  classNameFirst?: string;
  classNameSecond?: string;
}) => {
  return (
    <div
      className={clsx(
        'text-xs md:text-sm text-brand-gray flex gap-1',
        className,
      )}
    >
      <span className={classNameFirst}>{String(first)}</span>
      <div className="bg-brand-grayer/20 h-px grow relative bottom-1 self-end" />
      <span className={classNameSecond}>{String(second)}</span>
    </div>
  );
};

export default DividedTextLine;
