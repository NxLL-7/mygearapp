import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddGadget.css";
import "./Login.css";
import "../Toast.css";

export default function AddGadget() {
  const [step, setStep] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [gadgets, setGadgets] = useState([
    {
      name: "",
      product_name: "",
      description: "",
    },
  ]);

  // Update gadget name
  const handleNameChange = (index, value) => {
    const updatedGadgets = [...gadgets];
    updatedGadgets[index].name = value;
    setGadgets(updatedGadgets);
  };

  // Add another gadget field
  const addNameField = () => {
    const newIndex = gadgets.length;

    setGadgets([
      ...gadgets,
      {
        name: "",
        product_name: "",
        description: "",
      },
    ]);

    setTimeout(() => {
      const nextInput = document.getElementById(`gadget-input-${newIndex}`);
      if (nextInput) nextInput.focus();
    }, 0);
  };

  // Go to Step 2
  const handleNext = () => {
    const validGadgets = gadgets.filter((gadget) => gadget.name.trim() !== "");

    if (validGadgets.length === 0) {
      setErrorMessage("Please add at least one gadget name.");
      setTimeout(() => setErrorMessage(""), 2500);
      return;
    }

    setGadgets(validGadgets);
    setStep(2);
  };

  // Update description
  const handleDescriptionChange = (index, value) => {
    const updatedGadgets = [...gadgets];
    updatedGadgets[index].description = value;
    setGadgets(updatedGadgets);
  };

  const handleProductChange = (index, value) => {
    const updatedGadgets = [...gadgets];
    updatedGadgets[index].product_name = value;
    setGadgets(updatedGadgets);
  };

  const handleSave = async () => {
    const hasEmptyFields = gadgets.some(
      (g) =>
        !g.description ||
        g.description.trim() === "" ||
        !g.product_name ||
        g.product_name.trim() === ""
    );
    if (hasEmptyFields) {
      setErrorMessage("Please fill out all product names and descriptions.");
      setTimeout(() => setErrorMessage(""), 2500);
      return;
    }

    window.dispatchEvent(new Event('start-loading'));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/add-gadgets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ gadgetData: gadgets })
        })

      const result = await res.json()
      if (res.ok) {

        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          navigate("/about", { state: { gadgets } });
        }, 1500);

      } else {
        setErrorMessage(result.message || "Failed to add gadgets");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } catch (err) {
      console.log(err);
    } finally {
      window.dispatchEvent(new Event('stop-loading'));
    }
  };

  return (
    <div className="page-container">
      {showNotification && (
        <div className="toast-notification">
          <span className="toast-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <span className="toast-text">Data saved successfully!</span>
        </div>
      )}
      {errorMessage && (
        <div className="toast-notification error">
          <span className="toast-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </span>
          <span className="toast-text">
            {errorMessage}
          </span>
        </div>
      )}

      <div
        className={`container flex-col add-container ${step === 1 ? "align-center" : "align-stretch"}`}
      >
        {/* Step Indicator */}
        <div className="add-step-indicator">
          <div className={`add-step-dot ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
          </div>
          <div className={`add-step-line ${step >= 2 ? 'active' : ''}`} />
          <div className={`add-step-dot ${step >= 2 ? 'active' : ''}`}>
            <span>2</span>
          </div>
        </div>

        {step === 1 && (
          <div className="glass-panel add-panel animate-step">
            <div className="add-header">
              <div className="add-header-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <h2 className="add-title">Add to Inventory</h2>
              <p className="add-subtitle">Enter the names of gadgets you want to add. Press Enter to add more.</p>
            </div>
            <div className="flex-col gap-2">
              {gadgets.map((gadget, index) => (
                <div key={index} className="dynamic-field-row">
                  <div className="auth-input-wrapper" style={{ flex: 1 }}>
                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <input
                      id={`gadget-input-${index}`}
                      type="text"
                      className="glass-input auth-input"
                      placeholder="Gadget Name (e.g. iPhone 15 Pro)"
                      value={gadget.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addNameField();
                        }
                      }}
                      style={{ marginBottom: 0 }}
                    />
                  </div>

                  {index === gadgets.length - 1 && (
                    <button
                      type="button"
                      className="glass-button icon-only add-plus-btn"
                      onClick={addNameField}
                      title="Add another gadget"
                      aria-label="Add another gadget"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  )}
                </div>
              ))}
              <div className="add-next-btn-container">
                <button
                  className="glass-button add-next-btn"
                  onClick={handleNext}
                >
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="add-step2-container animate-step">
            <div className="add-header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <h2 className="add-title">Describe Your Gadgets</h2>
              <p className="add-subtitle">Add product names and descriptions for each gadget.</p>
            </div>
            <div className="flex-col gap-4">
              {gadgets.map((gadget, index) => (
                <div key={index} className="glass-panel add-step2-card" style={{ animationDelay: `${index * 80}ms` }}>
                  <div className="add-step2-card-header">
                    <div className="add-step2-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                      <span>{gadget.name}</span>
                    </div>
                  </div>
                  <div className="form-group add-step2-group">
                    <label className="auth-label">Product Name</label>
                    <input
                      type="text"
                      className="glass-input add-step2-input"
                      placeholder={`Product Name (e.g. MacBook Pro)`}
                      value={gadget.product_name}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      style={{ marginBottom: 'var(--space-4)' }}
                    />
                    <label className="auth-label">Description</label>
                    <textarea
                      className="glass-input add-step2-textarea"
                      placeholder={`Write about your ${gadget.name}...`}
                      rows={4}
                      value={gadget.description}
                      onChange={(e) =>
                        handleDescriptionChange(index, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <div className="glass-panel add-step2-footer">
                <button
                  className="glass-button secondary"
                  onClick={() => setStep(1)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                  Back
                </button>
                <button className="glass-button" onClick={handleSave}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Save All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
