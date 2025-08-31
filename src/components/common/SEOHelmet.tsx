import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title = 'Rawaiti Pehnawa - Premium Pakistani Fashion',
  description = 'Discover elegant Pakistani fashion for women and kids. Premium quality traditional wear, modern designs, and authentic craftsmanship by Nadia.',
  keywords = 'Pakistani fashion, women clothing, kids wear, traditional dress, shalwar kameez, ethnic wear, Rawaiti Pehnawa',
  image = '/Logo.jpeg',
  url = window.location.href
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Rawaiti Pehnawa" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Favicon */}
      <link rel="icon" type="image/jpeg" href="/Logo.jpeg" />
      <link rel="apple-touch-icon" href="/Logo.jpeg" />
    </Helmet>
  );
};

export default SEOHelmet;