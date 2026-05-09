'use client';

import { useMemo } from 'react';
import { useAppShell } from '@/components/AppContext';
import { HomePage } from '@/components/pages/HomePage';
import { mapBackendProductsToCatalogItems } from '@/lib/products/catalog';
import type { BackendProduct } from '@/lib/store/services/storefront-api';
import type { CatalogItem } from '@/lib/types';

interface Props {
  initialProducts: BackendProduct[];
}

export function HomepageClient({ initialProducts }: Props) {
  const { setActiveProduct, handleAddCurrentStory, handleAddCatalogItem, openShopSection, handleProductClick } =
    useAppShell();

  const catalogItems = useMemo<CatalogItem[]>(() => {
    return mapBackendProductsToCatalogItems(initialProducts);
  }, [initialProducts]);

  return (
    <HomePage
      catalogItems={catalogItems}
      onSelectProduct={setActiveProduct}
      onAddDetailToCart={handleAddCurrentStory}
      onAddCatalogToCart={handleAddCatalogItem}
      onBrowseCollection={openShopSection}
      onProductClick={handleProductClick}
    />
  );
}
