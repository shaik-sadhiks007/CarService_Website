import React, { useState, useRef, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import { Resizable } from "re-resizable";
import Draggable from "react-draggable";
import "react-simple-keyboard/build/css/index.css";

const keyboardContainerStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 9999,
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
  padding: 0
};

// Responsive style for mobile only
const responsiveStyle = `
@media (max-width: 480px) {
  .virtual-keyboard-mobile {
    width: 98vw !important;
    min-width: 0 !important;
    max-width: 100vw !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    min-height: 160px !important;
    max-height: 350px !important;
    height: 220px !important;
  }
}
`;

const dragHandleStyle = {
  width: "100%",
  height: 32,
  background: "#f1f1f1",
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  cursor: "move",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontWeight: 600,
  color: "#888",
  letterSpacing: 2,
  userSelect: "none",
  padding: "0 12px"
};

const closeBtnStyle = {
  border: "none",
  background: "none",
  fontSize: 18,
  cursor: "pointer",
  color: "#888",
  marginLeft: 8
};

const VirtualKeyboard = ({ input, onChange, onClose }) => {
  // Use original desktop/tablet size
  const [layoutName, setLayoutName] = useState("default");
  const [size, setSize] = useState({ width: 500, height: 320 });
  const keyboardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(input || "");
    }
  }, [input]);

  // Detect mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const handleShift = () => {
    setLayoutName((prevLayout) => (prevLayout === "default" ? "shift" : "default"));
  };

  // The close button calls this, and parent should hide the keyboard when onClose is called
  const handleClose = () => {
    console.log("VirtualKeyboard: handleClose called"); // Debug log
    if (onClose) onClose();
  };

  const keyboardContent = (
    <Resizable
      size={size}
      onResizeStop={(e, direction, ref, d) => {
        setSize({
          width: size.width + d.width,
          height: size.height + d.height
        });
      }}
      minWidth={350}
      minHeight={220}
      maxWidth={900}
      maxHeight={700}
      style={keyboardContainerStyle}
      className="virtual-keyboard-mobile"
      enable={{
        top: true, right: true, bottom: true, left: true,
        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
      }}
    >
      <div className="keyboard-drag-handle" style={dragHandleStyle}>
        <span>Drag Keyboard</span>
        <button onClick={handleClose} style={closeBtnStyle} title="Close">✕</button>
      </div>
      <div style={{ flex: 1, padding: 6 }}>
        <Keyboard
          keyboardRef={r => (keyboardRef.current = r)}
          layoutName={layoutName}
          onChange={onChange}
          onKeyPress={onKeyPress}
          input={input}
        />
      </div>
    </Resizable>
  );

  return (
    <>
      <style>{responsiveStyle}</style>
      {isMobile ? (
        // Not draggable on mobile
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {keyboardContent}
        </div>
      ) : (
        // Draggable on desktop/tablet
        <Draggable handle=".keyboard-drag-handle">
          {keyboardContent}
        </Draggable>
      )}
    </>
  );
};

export default VirtualKeyboard; 