"use client"

import React from 'react';
import AnimePage from '@/components/anime/page';
import { usePathname } from 'next/navigation';

export default function GenrePage() {
  const pathname = usePathname();
  const genre = pathname.split('/')[2];

  return <AnimePage label={genre ? decodeURIComponent(genre) : ''} apiEndpoint="getByGenre" genre={genre} />;
}