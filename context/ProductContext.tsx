
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS, DEFAULT_SECTIONS } from '../constants';
import { db, firebaseConfig } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot, getDoc } from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  sections: string[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addSection: (name: string) => void;
  deleteSection: (name: string) => void;
  restoreData: (products: Product[], sections: string[]) => void;
  migrateToFirebase: () => Promise<void>;
  isFirebaseLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);

  // Load from Firebase
  useEffect(() => {
    // Check if Firebase is configured
    if (!firebaseConfig.projectId) {
      console.warn("Firebase config missing, falling back to local storage temporarily");
      setProducts(() => {
        try {
          const saved = localStorage.getItem('shop_products');
          return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
        } catch (e) {
          return DEFAULT_PRODUCTS;
        }
      });
      setSections(() => {
        try {
          const saved = localStorage.getItem('shop_sections');
          return saved ? JSON.parse(saved) : DEFAULT_SECTIONS;
        } catch (e) {
          return DEFAULT_SECTIONS;
        }
      });
      setIsFirebaseLoading(false);
      return;
    }

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach(doc => {
        prods.push(doc.data() as Product);
      });
      setProducts(prods);
      setIsFirebaseLoading(false);
    }, (error) => {
      console.error("Error fetching products from Firebase:", error);
      setIsFirebaseLoading(false);
    });

    const unsubscribeSections = onSnapshot(doc(db, 'storeConfig', 'sections'), (docSnap) => {
      if (docSnap.exists()) {
        setSections(docSnap.data().list || []);
      }
    }, (error) => {
      console.error("Error fetching sections from Firebase:", error);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeSections();
    };
  }, []);

  // Update localStorage as a fallback backup whenever products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('shop_products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (sections.length > 0) {
      localStorage.setItem('shop_sections', JSON.stringify(sections));
    }
  }, [sections]);

  const addProduct = async (product: Product) => {
    if (!firebaseConfig.projectId) {
      setProducts(prev => [...prev, product]);
      return;
    }
    await setDoc(doc(db, 'products', product.id), product);
  };

  const updateProduct = async (updatedProduct: Product) => {
    if (!firebaseConfig.projectId) {
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      return;
    }
    await setDoc(doc(db, 'products', updatedProduct.id), updatedProduct);
  };

  const deleteProduct = async (id: string) => {
    if (!firebaseConfig.projectId) {
      setProducts(prev => prev.filter(p => p.id !== id));
      return;
    }
    await deleteDoc(doc(db, 'products', id));
  };

  const addSection = async (name: string) => {
    if (!firebaseConfig.projectId) {
      if (!sections.includes(name)) setSections(prev => [...prev, name]);
      return;
    }
    if (!sections.includes(name)) {
      const newSections = [...sections, name];
      await setDoc(doc(db, 'storeConfig', 'sections'), { list: newSections });
    }
  };

  const deleteSection = async (name: string) => {
    if (!firebaseConfig.projectId) {
      setSections(prev => prev.filter(s => s !== name));
      return;
    }
    const newSections = sections.filter(s => s !== name);
    await setDoc(doc(db, 'storeConfig', 'sections'), { list: newSections });
  };

  const restoreData = async (newProducts: Product[], newSections: string[]) => {
    if (!firebaseConfig.projectId) {
      setProducts(newProducts);
      setSections(newSections);
      return;
    }
    
    await setDoc(doc(db, 'storeConfig', 'sections'), { list: newSections });
    for (const p of newProducts) {
      await setDoc(doc(db, 'products', p.id), p);
    }
  };

  const migrateToFirebase = async () => {
    if (!firebaseConfig.projectId) {
      alert("Firebase is not configured yet! Please add the Firebase credentials to your environment.");
      return;
    }
    try {
      // Save sections
      const localSections = localStorage.getItem('shop_sections');
      const sectsToMigrate = localSections ? JSON.parse(localSections) : DEFAULT_SECTIONS;
      await setDoc(doc(db, 'storeConfig', 'sections'), { list: sectsToMigrate });

      // Save products
      const localProducts = localStorage.getItem('shop_products');
      const prodsToMigrate = localProducts ? JSON.parse(localProducts) : DEFAULT_PRODUCTS;
      
      for (const p of prodsToMigrate) {
        await setDoc(doc(db, 'products', p.id), p);
      }
      alert("Data successfully migrated to Firebase!");
    } catch (e) {
      console.error("Migration failed:", e);
      alert("Migration failed. Check console.");
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      sections,
      addProduct, 
      updateProduct, 
      deleteProduct,
      addSection,
      deleteSection,
      restoreData,
      migrateToFirebase,
      isFirebaseLoading
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
