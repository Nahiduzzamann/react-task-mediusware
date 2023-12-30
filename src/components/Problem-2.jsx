import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import FormCheck from "react-bootstrap/FormCheck";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const Problem2 = () => {
  const navigateTo = useNavigate();
  const [modalAVisible, setModalAVisible] = useState(false);
  const [modalBVisible, setModalBVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [onlyEven, setOnlyEven] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  useEffect(() => {
    const filtered = onlyEven
      ? contacts?.filter((contact) => contact.id % 2 === 0)
      : contacts;
    setFilteredContacts(filtered);
  }, [onlyEven]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  useEffect(() => {
    if(searchInput){
        const delay = 300; 
    const timeoutId = setTimeout(() => {
    fetch(`https://contact.mediusware.com/api/contacts/?search=${searchInput}`)
      .then((response) => response.json())
      .then((data) => {
        setContacts(data.results);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }, delay);

    return () => clearTimeout(timeoutId);
    }
  }, [searchInput]);

//   useEffect(() => {
//     fetch("https://contact.mediusware.com/api/contacts/")
//       .then((response) => response.json())
//       .then((data) => {
//         setContacts(data.results);
//         // console.log(data.results);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, []);

  const fetchContacts = async (country = "", search = "") => {
    const baseUrl = "https://contact.mediusware.com/api";
    const endpoint = country ? `/country-contacts/${country}/` : "/contacts/";
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    const url = `${baseUrl}${endpoint}?${params.toString()}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // console.log(data.results);
        return data.results;
      } else {
        throw new Error("Failed to fetch contacts.");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = async () => {
    const country = modalBVisible ? "United States" : "";
    const contacts = await fetchContacts(country, searchInput);
    setContacts(contacts)
    setFilteredContacts(contacts);
  };

  const openModalA = () => {
    // setSearchInput('')
    setModalAVisible(true);
    setModalBVisible(false);
    handleSearch();
    navigateTo("/modal-a", { replace: true });
  };

  const openModalB = () => {
    // setSearchInput('')
    setModalAVisible(false);
    setModalBVisible(true);
    
    handleSearch();
    navigateTo("/modal-b", { replace: true });
  };

  const closeModal = () => {
    setModalAVisible(false);
    setModalBVisible(false);
    navigateTo("/problem-2", { replace: true });
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const closeContactDetailsModal = () => {
    setSelectedContact(null);
  };

  useEffect(() => {
    // You can also trigger search when the searchInput state changes
    handleSearch();
  }, [searchInput]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <Button variant="outline-primary" onClick={openModalA} size="lg">
            All Contacts
          </Button>
          <Button variant="outline-warning" onClick={openModalB} size="lg">
            US Contacts
          </Button>
        </div>
      </div>

      {/* Modal A */}
      <Modal show={modalAVisible} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal A</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search..."
              value={searchInput}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </InputGroup>
          {filteredContacts?.map((contact) => (
            <div
              key={contact?.id}
              className="contact-item m-1"
              onClick={() => handleContactClick(contact)}
            >
              <button
                className="d-inline-block p-2 bg-light w-100 border-none border border-0"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Click to show details..."
              >
                {contact?.phone}
              </button>
            </div>
          ))}
          <Button
          className="me-2"
            style={{ backgroundColor: "#46139f", color: "white" }}
            onClick={openModalA}
          >
            All Contacts
          </Button>
          <Button
          className="me-2"
            style={{ backgroundColor: "#ff7f50", color: "white" }}
            onClick={openModalB}
          >
            US Contacts
          </Button>
          <Button
            style={{ backgroundColor: "#46139f", color: "white" }}
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <FormCheck
            type="checkbox"
            label="Only even"
            id="onlyEvenCheckbox"
            checked={onlyEven}
            onChange={() => setOnlyEven(!onlyEven)}
          />
        </Modal.Footer>
      </Modal>

      {/* Modal B */}
      <Modal show={modalBVisible} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal B</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            placeholder="Search..."
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
          />
          {filteredContacts
            ?.filter((contact) => contact?.country?.name === "United States")
            .map((contact) => (
              <button
                key={contact?.id}
                className="d-inline-block p-2 m-1 bg-light w-100 border-none border border-0"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Click to show details..."
                onClick={() => handleContactClick(contact)}
              >
                {contact?.phone}
              </button>
            ))}
          <Button
          className="me-2"
            style={{ backgroundColor: "#46139f", color: "white" }}
            onClick={openModalA}
          >
            All Contacts
          </Button>
          <Button
          className="me-2"
            style={{ backgroundColor: "#ff7f50", color: "white" }}
            onClick={openModalB}
          >
            US Contacts
          </Button>
          <Button
            style={{ backgroundColor: "#46139f", color: "white" }}
            onClick={closeModal}
          >
            Close
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <FormCheck
            type="checkbox"
            label="Only even"
            id="onlyEvenCheckbox"
            checked={onlyEven}
            onChange={() => setOnlyEven(!onlyEven)}
          />
        </Modal.Footer>
      </Modal>

      {/* Contact Details Modal */}
      <Modal
        show={!!selectedContact}
        onHide={closeContactDetailsModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal C</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ID: {selectedContact?.id}</p>
          <p>Phone: {selectedContact?.phone}</p>
          <p>Country: {selectedContact?.country?.name}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Problem2;
