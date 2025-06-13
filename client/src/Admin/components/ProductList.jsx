const ProductList = ({ products, onEdit, onDelete, onPreview }) => (
  
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Image</th>
        <th>Name</th>
        <th>Category</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map(product => (
        <tr key={product.id}>
          <td>{product.id}</td>
          <td><img src={product.image} alt={product.name} /></td>
          <td>{product.name}</td>
          <td>{product.category}</td>
          <td>
            <button onClick={() => onEdit(product)}>Edit</button>
            <button onClick={() => onDelete(product.id)}>Delete</button>
            <button onClick={() => onPreview(product)}>Preview</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
