import React, { useEffect, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";

const ContactUsEnquiry = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          "http://20.40.59.234:3000/api/contact/getContacts"
        );
        const data = await response.json();
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setContacts(sorted);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const openDeleteModal = (contact) => {
    setContactToDelete(contact);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;

    try {
      const response = await fetch(
        `http://20.40.59.234:3000/api/contact/deleteContact/${contactToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setContacts((prev) =>
          prev.filter((contact) => contact._id !== contactToDelete._id)
        );
      } else {
        console.error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setIsConfirmDeleteOpen(false);
      setContactToDelete(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDeleteContact}
        title="Delete Contact"
        message={
          contactToDelete
            ? `Are you sure you want to delete "${contactToDelete.name}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Header and Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <h2 style={headingStyle}>Enquiries</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={searchInputStyle}
        />
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "60px" }}>S.No</th>
              <th style={{ ...thStyle, width: "200px" }}>Name</th>
              <th style={{ ...thStyle, width: "250px" }}>Email</th>
              <th style={{ ...thStyle, width: "400px" }}>Message</th>
              <th style={{ ...thStyle, width: "120px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((contact, index) => (
              <tr key={contact._id}>
                <td
                  style={cellStyle("60px")}
                  title={indexOfFirstItem + index + 1}
                >
                  {indexOfFirstItem + index + 1}
                </td>
                <td style={cellStyle("200px")} title={contact.name}>
                  {contact.name}
                </td>
                <td style={cellStyle("250px")} title={contact.email}>
                  {contact.email}
                </td>
                <td style={cellStyle("400px")} title={contact.message}>
                  {contact.message}
                </td>
                <td style={cellStyle("120px")}>
                  <button
                    onClick={() => openDeleteModal(contact)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentContacts.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          style={{
            ...paginationButtonStyle,
            backgroundColor: "#007bff",
            opacity: currentPage === 1 ? 0.6 : 1,
          }}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{
            ...paginationButtonStyle,
            backgroundColor: "#28a745",
            opacity: currentPage === totalPages ? 0.6 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Styles
const headingStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  margin: 0,
};

const searchInputStyle = {
  width: "200px",
  padding: "6px 10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
  backgroundColor: "#f8f9fa",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#f0f0f0",
  textAlign: "left",
};

const tdStyleBase = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const cellStyle = (width) => ({
  ...tdStyleBase,
  width,
  maxWidth: width,
});

const paginationButtonStyle = {
  width: "100px",
  padding: "8px 0",
  margin: "0 5px",
  border: "none",
  borderRadius: "4px",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
};

const deleteButtonStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#dc3545",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

export default ContactUsEnquiry;
