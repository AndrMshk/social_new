import React from 'react';
import { Image } from 'antd';
import test from '../../../img/test.jpg'

export const Profile = () => {
  return (
    <>
      <Image
        width={200}
        src={test}
      />
    </>
  );
};