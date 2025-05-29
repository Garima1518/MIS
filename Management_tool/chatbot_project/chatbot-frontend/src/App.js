// import React, { useState, useRef, useEffect } from "react";

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const chatContainerRef = useRef(null);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 3000));

//       const response = await fetch("http://172.16.101.127:3002/chat", {

//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch");

//       const data = await response.json();
//       const botMessage = { sender: "bot", text: data.reply };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (err) {
//       console.error("Error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Unable to connect to server" },
//       ]);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const styles = {
//     container: {
//       maxWidth: "450px",
//       margin: "30px auto",
//       padding: "20px",
//       borderRadius: "20px",
//       background: "linear-gradient(to bottom right, #f8f9fa, #e3e9f0)",
//       boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//     },
//     title: {
//       textAlign: "center",
//       marginBottom: "20px",
//       fontSize: "22px",
//       fontWeight: "bold",
//       color: "#333",
//     },
//     chatBox: {
//       minHeight: "320px",
//       maxHeight: "420px",
//       overflowY: "auto",
//       padding: "15px",
//       borderRadius: "15px",
//       background: "#ffffff",
//       boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
//       border: "1px solid #e1e4e8",
//     },
//     inputWrapper: {
//       display: "flex",
//       alignItems: "center",
//       marginTop: "15px",
//     },
//     input: {
//       flex: 1,
//       padding: "12px 16px",
//       borderRadius: "30px",
//       border: "1px solid #ccc",
//       fontSize: "14px",
//       outline: "none",
//     },
//     sendButton: {
//       marginLeft: "10px",
//       padding: "10px 18px",
//       borderRadius: "30px",
//       background: "#007bff",
//       border: "none",
//       color: "#fff",
//       fontWeight: "500",
//       cursor: "pointer",
//       transition: "background 0.3s ease",
//     },
//     message: (isUser) => ({
//       alignSelf: isUser ? "flex-end" : "flex-start",
//       background: isUser ? "#dcf8c6" : "#f1f0f0",
//       color: "#333",
//       padding: "10px 15px",
//       borderRadius: isUser ? "18px 18px 0 18px" : "18px 18px 18px 0",
//       marginBottom: "10px",
//       maxWidth: "80%",
//       wordWrap: "break-word",
//       fontSize: "14px",
//       boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
//       animation: "fadeIn 0.3s ease-in-out",
//     }),
//     typing: {
//       textAlign: "left",
//       color: "#aaa",
//       fontStyle: "italic",
//       fontSize: "13px",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>🤖 MinebeaMitsumi Chatbot</h2>

//       <div style={styles.chatBox} ref={chatContainerRef}>
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             style={{
//               display: "flex",
//               justifyContent:
//                 msg.sender === "user" ? "flex-end" : "flex-start",
//             }}
//           >
//             <div style={styles.message(msg.sender === "user")}>{msg.text}</div>
//           </div>
//         ))}

//         {loading && (
//           <div style={styles.typing}>
//             <span className="typing-dots">Bot is typing...</span>
//           </div>
//         )}
//       </div>

//       <div style={styles.inputWrapper}>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type your message..."
//           style={styles.input}
//         />
//         <button
//           onClick={sendMessage}
//           style={styles.sendButton}
//           onMouseOver={(e) => (e.target.style.background = "#0056b3")}
//           onMouseOut={(e) => (e.target.style.background = "#007bff")}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default App;












import React, { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulated bot response after 2 seconds
    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: "Chatbot is under training... Please try again later.",
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const styles = {
    container: {
      maxWidth: "450px",
      margin: "30px auto",
      padding: "20px",
      borderRadius: "20px",
      background: "linear-gradient(to bottom right, #f8f9fa, #e3e9f0)",
      boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "22px",
      fontWeight: "bold",
      color: "#333",
    },
    chatBox: {
      minHeight: "320px",
      maxHeight: "420px",
      overflowY: "auto",
      padding: "15px",
      borderRadius: "15px",
      background: "#ffffff",
      boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e1e4e8",
    },
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      marginTop: "15px",
    },
    input: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "30px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
    },
    sendButton: {
      marginLeft: "10px",
      padding: "10px 18px",
      borderRadius: "30px",
      background: "#007bff",
      border: "none",
      color: "#fff",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background 0.3s ease",
    },
    message: (isUser) => ({
      alignSelf: isUser ? "flex-end" : "flex-start",
      background: isUser ? "#dcf8c6" : "#f1f0f0",
      color: "#333",
      padding: "10px 15px",
      borderRadius: isUser ? "18px 18px 0 18px" : "18px 18px 18px 0",
      marginBottom: "10px",
      maxWidth: "80%",
      wordWrap: "break-word",
      fontSize: "14px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
      animation: "fadeIn 0.3s ease-in-out",
    }),
    typing: {
      textAlign: "left",
      color: "#aaa",
      fontStyle: "italic",
      fontSize: "13px",
      padding: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🤖 MinebeaMitsumi Chatbot</h2>

      <div style={styles.chatBox} ref={chatContainerRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div style={styles.message(msg.sender === "user")}>{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div style={styles.typing}>Bot is typing...</div>
        )}
      </div>

      <div style={styles.inputWrapper}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button
          onClick={sendMessage}
          style={styles.sendButton}
          onMouseOver={(e) => (e.target.style.background = "#0056b3")}
          onMouseOut={(e) => (e.target.style.background = "#007bff")}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
