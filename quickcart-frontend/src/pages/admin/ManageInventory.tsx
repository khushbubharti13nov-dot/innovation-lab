import { useState, useEffect } from 'react';
// --- FIX: Added '.js' to all local imports ---
import * as productService from '../../services/productService.js';
import * as inventoryService from '../../services/inventoryService.js';
import type { Product } from '../../services/productService.js';
import type { InventoryItem } from '../../services/inventoryService.js';
import styles from './ManageInventory.module.scss';

const ManageInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  // The 'products' linter warning will go away once 'fetchData' is used
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // States for the new product form
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(0);

  // State for updating quantities in the table
  const [editQuantities, setEditQuantities] = useState<Record<string, number>>(
    {}
  );

  // Fetch all data on load
  const fetchData = async () => {
    setLoading(true);
    try {
      const [inventoryData, productsData] = await Promise.all([
        inventoryService.getInventory(),
        productService.getProducts(),
      ]);
      setInventory(inventoryData);
      setProducts(productsData); // <-- 'setProducts' is used here

      // Initialize the edit quantities state
      const quantities = inventoryData.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {} as Record<string, number>);
      setEditQuantities(quantities);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler for creating a new product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.createProduct({
        name: newProductName,
        price: newProductPrice,
      });
      // Clear form and refetch data
      setNewProductName('');
      setNewProductPrice(0);
      fetchData(); // This refetches products and inventory
    } catch (error: unknown) { // --- FIX: Catch as 'unknown' ---
      console.error('Failed to create product', error);
      if (error instanceof Error) {
        alert(`Failed to create product: ${error.message}`);
      } else {
        alert('Failed to create product');
      }
    }
  };

  // Handler for updating an inventory item's quantity
  const handleUpdateQuantity = async (id: string) => {
    const newQuantity = editQuantities[id];
    try {
      await inventoryService.updateInventoryQuantity(id, newQuantity);
      // Refetch data to confirm
      fetchData();
      alert('Quantity updated!');
    } catch (error: unknown) { // --- FIX: Catch as 'unknown' ---
      console.error('Failed to update quantity', error);
      if (error instanceof Error) {
        alert(`Failed to update quantity: ${error.message}`);
      } else {
        alert('Failed to update quantity');
      }
    }
  };

  if (loading) {
    return <div>Loading inventory...</div>;
  }

  return (
    <div className={styles.inventoryPage}>
      <h1>Manage Inventory</h1>

      {/* --- Section 1: Create New Product --- */}
      <div className={styles.card}>
        <h2>Create New Product</h2>
        <form onSubmit={handleCreateProduct} className={styles.formGrid}>
          <div>
            <label>Product Name</label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="e.g., Organic Apples"
              required
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(parseFloat(e.target.value))}
              required
            />
          </div>
          <button type="submit">Create Product</button>
        </form>
      </div>

      {/* --- Section 2: Manage Existing Inventory --- */}
      <div className={styles.card}>
        <h2>Current Inventory</h2>
        <p>
          Products you create must be added to a store to appear here.
        </p>
        <table className={styles.inventoryTable}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Store</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  No inventory items found.
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.sku}</td>
                  <td>{item.product.name}</td>
                  <td>{item.darkStore?.name || 'Main Store'}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      className={styles.quantityInput}
                      value={editQuantities[item.id] || 0}
                      onChange={(e) =>
                        setEditQuantities({
                          ...editQuantities,
                          [item.id]: parseInt(e.target.value, 10),
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className={styles.updateButton}
                      onClick={() => handleUpdateQuantity(item.id)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageInventory;