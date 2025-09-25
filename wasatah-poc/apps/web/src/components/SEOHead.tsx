import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead = ({
  title = 'Wasatah.app - Blockchain + AI Real Estate Platform',
  description = 'The future of real estate transactions powered by blockchain technology, AI, and Zero-Knowledge Proofs for secure, transparent property deals.',
  keywords = 'real estate, blockchain, AI, zero-knowledge proofs, property transactions, Saudi Arabia, NAFTA, KYC, AML',
  image = '/images/wasatah-logo.png',
  url = 'https://wasatah-poc.netlify.app',
  type = 'website'
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = title;
      document.head.appendChild(meta);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', url);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      meta.content = url;
      document.head.appendChild(meta);
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', image);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.content = image;
      document.head.appendChild(meta);
    }
    
    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) {
      ogType.setAttribute('content', type);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:type');
      meta.content = type;
      document.head.appendChild(meta);
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:title';
      meta.content = title;
      document.head.appendChild(meta);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', image);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:image';
      meta.content = image;
      document.head.appendChild(meta);
    }
    
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (twitterCard) {
      twitterCard.setAttribute('content', 'summary_large_image');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:card';
      meta.content = 'summary_large_image';
      document.head.appendChild(meta);
    }
    
  }, [title, description, keywords, image, url, type]);

  return null; // This component doesn't render anything
};

export default SEOHead;
