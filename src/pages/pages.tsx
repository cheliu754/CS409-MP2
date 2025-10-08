import React from 'react';
import { Gallery } from '../components/components';
import { mockItems } from '../functions/utensil';

export const ListPage = ({ onItemClick }: { onItemClick?: (item: any) => void }) => <Gallery items={mockItems} onItemClick={onItemClick} />;

export const DetailPage = ({ item }: { item: any }) => (
  <div className="detail-view">
    <h3>{item.title || item.name}</h3>
    <img src={item.poster_path || item.image} alt={item.title || item.name} style={{ width: 180, height: 270, objectFit: 'cover', background: '#333' }} />
    <p>{item.release_date}</p>
    <p>{item.overview}</p>
    <p>Rating: {item.rating}</p>
    <p>Popularity: {item.popularity}</p>
  </div>
);