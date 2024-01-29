import React from 'react';

interface IDangerHtmlUlProps {
  text: string;
}

const DangerHtmlUl = ({ text }: IDangerHtmlUlProps) => (
  <ul dangerouslySetInnerHTML={{ __html: text }}></ul>
);

export default DangerHtmlUl;
